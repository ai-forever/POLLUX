import os
import re
import yaml
import random
import argparse
from collections import Counter

import datasets
import pandas as pd
from transformers import AutoTokenizer

random.seed(42)


def clean_problem(problem_text):
    problem_text = problem_text.split("[PROBLEM]")[-1].strip("\n ")
    problem_text = problem_text.split("[END]")[0].strip("\n ")
    return problem_text


def clean_reference(ref_text):
    ref_text = re.sub("<\/?think>", "", ref_text)
    return ref_text


def format_prompt(example: dict, template: str = "./prompt_template.yaml") -> str:
    if isinstance(template, str):
        with open(template, encoding='utf8') as f:
            template = yaml.safe_load(f)
    
    def get_nested(d: dict, key_path: str, default=""):
        keys = key_path.split(".")
        for key in keys:
            if key in d:
                d = d[key]
            else:
                return default
        return d

    def replace_placeholders(template: str, ph_dict: dict):
        for field, value in ph_dict.items():
            template = template.replace("{" + field + "}", value)
        return template

    filled_sections = []
    for key, template in template.items():
        placeholders = [part.strip("{}") for part in template.split() if part.startswith("{") and part.endswith("}")]
        try:
            values = {}
            for ph in placeholders:
                values[ph] = get_nested(example, ph, None)
                if ph == "enhanced_generated_problem":
                    values[ph] = clean_problem(values[ph])
                elif ph == "true_answer":
                    if values[ph] is not None:
                        values[ph] = clean_reference(values[ph])
                    else:
                        values[ph] = ''
            if all(v is not None for v in values.values()):
                filled_sections.append(replace_placeholders(template, values))
        except KeyError as e:
            print(e)
            continue

    return "\n\n".join(filled_sections)


def detect_language(text):
    words = re.findall(r"\b\w+\b", text)
    ru_pattern = re.compile(r"[а-яА-Я]")
    en_pattern = re.compile(r"[a-zA-Z]")

    lang_counts = Counter()
    for word in words:
        if ru_pattern.search(word):
            lang_counts["ru"] += 1
        elif en_pattern.search(word):
            lang_counts["en"] += 1

    if lang_counts:
        return lang_counts.most_common(1)[0][0]
    return "unknown"


def extract_score(text):
    res = re.search("(?<=\[RESULT\] )\s*\d", text)
    if res is not None:
        return float(res.group(0).strip())
    else:
        return None

def tokenize_with_chat_template(batch, tokenizer):
    formatted_texts = []
    for prompt, score in zip(batch["prompt"], batch["score"]):
        messages = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": score},
        ]
        formatted = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=False,
            return_tensors="pt",
            tokenize=False,
        )
        formatted_texts.append(formatted)
    tokenized = tokenizer(formatted_texts,
                          padding="do_not_pad",
                          truncation=False,
                          max_length=None,
                          add_special_tokens=False)
    return {
        "input_ids": tokenized["input_ids"],
        "attention_mask": tokenized["attention_mask"],
    }


def check_score_format(score_text):
    patterns = [
        ("full", "^\"?\**\[?FEEDBACK:?\]?\** *([\s\S]*?)\**\[?RESULT:?\]?\** *\n*\(?\d\)?\**\"?"),
        ("no_score", "^\[FEEDBACK\] *([\s\S]*)$"),
        ("no_tag", "^([\s\S]*?)\**\[RESULT\]\** *\n*\(?\d\)?\**$"),
    ]
    if detect_language(score_text) == "en":
        return "en"
    for patt_name, patt in patterns:
        if re.search(patt, score_text, re.DOTALL) is not None:
            return patt_name
    return "unk"


def fix_score_format(score_text, strict_pattern="^\[FEEDBACK\] ([\s\S]*?) \[RESULT\] \d \[END\]$"):
    if re.search(strict_pattern, score_text, re.DOTALL) is not None:
        return score_text
    feedback_pattern = "\"?\**\[?FEEDBACK:?\]?\** *\n*"
    result_pattern = " *\n*\**\[?RESULT:?\]?\** *\n*\(?\d\)?\**\"?"

    if "RESULT" not in score_text:
        return ""
    score_text = re.sub(feedback_pattern, "[FEEDBACK] ", score_text)
    splitted = re.split(" *\n*\**\[?RESULT:?\]?\** *\n*", score_text)
    score_text_only, score_part = splitted[0], splitted[-1].replace('[END]', '')
    score_part = score_part.strip("()\n \"\'")
    if score_part == "":
        return ""
    try:
        float_score = float(score_part)
    except:
        return ""
    formatted_text = score_text_only.strip("\n ") + " [RESULT] " + score_part + " [END]"
    if re.search(strict_pattern, formatted_text, re.DOTALL) is not None:
        return formatted_text
    return ""


def clean_score_for_regression(score_text):
    return score_text.split('[RESULT]')[0] + "[END]"


def process_dataset(raw_data_path, task_type):
    print("Reading and filtering raw data...")
    ds = datasets.load_from_disk(raw_data_path)
    print(f"Found {len(ds)} raw samples.")
    ds = ds.filter(lambda example: example["score"] != "", num_proc=16)
    print(f"Done. Kept {len(ds)} samples.")

    print("Checking answer format...")
    ds = ds.map(lambda sample: {"format": check_score_format(sample["score"])}, num_proc=16)
    print(f'Done. Raw format stats: {Counter(ds["format"])}')

    print("Fixing answer format...")
    ds = ds.filter(lambda sample: sample["format"] == "full")
    ds = ds.map(lambda sample: {"score": fix_score_format(sample["score"])}, num_proc=16)
    ds = ds.filter(lambda sample: sample["score"] != "", num_proc=16)
    print(f"Done. Kept {len(ds)} samples with fixed format.")
    ds = ds.remove_columns(["format"])

    print("Extracting target scores...")
    ds = ds.map(lambda example: {"regression_labels": extract_score(example["score"])}, num_proc=16)

    if task_type == "regression":
        print("Clean for regression...")
        ds = ds.map(lambda example: {"score": clean_score_for_regression(example["score"])}, num_proc=16)

    print("Formatting prompts...")
    ds = ds.map(lambda example: {"prompt": format_prompt(example, prompt_template)}, num_proc=16)

    print("Running tokenization...")
    tokenizer = AutoTokenizer.from_pretrained(args.tok_path,
                                              pad_token='<|eot_id|>',
                                              cache_dir='./model_cache',
                                              padding=None)
    ds = ds.map(lambda batch: tokenize_with_chat_template(batch, tokenizer), batched=True,
                batch_size=args.tok_batch_size, num_proc=16)

    print("Filtering dataset by sample length...")
    ds = ds.filter(lambda example: len(example["input_ids"]) <= args.max_sample_tokens, num_proc=16)
    print(f"Done. Kept {len(ds)} samples with the number of tokens <= {args.max_sample_tokens}.")

    return ds


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--raw_data_train', type=str)
    parser.add_argument('--raw_data_eval', type=str, default=None)
    parser.add_argument('--output_dir_train', type=str, default="../data/processed/tlite_v2/train_deepseek_scores")
    parser.add_argument('--output_dir_eval', type=str, default="../data/processed/tlite_v2/eval_deepseek_scores")
    parser.add_argument('--tok_path', type=str, default="t-tech/T-lite-it-1.0")
    parser.add_argument('--tok_batch_size', type=int, default=4096)
    parser.add_argument('--prompt_template', type=str, default="./data_utils/prompt_template.yaml")
    parser.add_argument('--max_sample_tokens', type=int, default=4096)
    parser.add_argument('--train_test_split', type=bool, default=True)
    parser.add_argument('--train_test_split_seed', type=int, default=42)
    parser.add_argument('--test_size', type=float, default=0.001)
    parser.add_argument('--enable_cache', type=bool, default=False)
    parser.add_argument('--task_type', type=str, default="causal")

    args = parser.parse_args()

    if not args.enable_cache:
        datasets.disable_caching()

    with open(args.prompt_template) as rf:
        prompt_template = yaml.safe_load(rf)

    os.makedirs(args.output_dir_train, exist_ok=True)
    os.makedirs(args.output_dir_eval, exist_ok=True)

    print("\n\n===== TRAIN DATA =====\n")

    ds = process_dataset(args.raw_data_train, args.task_type)

    print("\n\n===== EVALUATION DATA =====\n")
    if args.raw_data_eval is None:
        print("No `raw_data_eval` provided.")
        if args.train_test_split:
            print("Will split train data into train and eval (since `train_test_split = True`).")
            test_problems = ['ИИ как персонаж (бытовая ситуация)',
                             'ИИ как персонаж (экспертная ситуация)',
                             'Прикладной брейншторминг',
                             'Дать рекомендации',
                             'Написать художественный текст', 'Стайл-трансфер', 'Придумать вопрос к тексту', 'Изменить код']
            ds_test = ds.filter(lambda sample: sample["problem_type_new"] in test_problems, num_proc=16)
            ds = ds.filter(lambda sample: sample["problem_type_new"] not in test_problems, num_proc=16)
            ds = datasets.DatasetDict({'train': ds, 'test': ds_test})
        else:
            print("Will return train split only (since `train_test_split = False`).")
            ds = datasets.DatasetDict({"train": ds})
    else:
        ds = datasets.DatasetDict({"train": ds})
        ds["test"] = process_dataset(args.raw_data_eval, args.task_type)

    ds["train"].save_to_disk(args.output_dir_train)
    ds["test"].save_to_disk(args.output_dir_eval)
    print(f"Final train dataset ({len(ds['train'])} samples) saved to `{args.output_dir_train}`.")
    print(f"Final eval dataset ({len(ds['test'])} samples) saved to `{args.output_dir_eval}`.")
