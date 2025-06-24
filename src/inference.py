import os
import datasets
from data_utils.preprocess_data import format_prompt
from vllm_offline_generation import offline_generation, offline_regression
import json
import fire
import torch
from utils.evaluation import TextEvaluator
from transformers import AutoTokenizer

LOG_DIR = './logs'


class Scoring(object):
    def __init__(self, test_path, template_path, num_proc):
        self.num_proc = num_proc
        ds = datasets.load_dataset(test_path)['test']
        ds = ds.remove_columns(['model_id', 'task_type', 'task_subtype', 'task_subsubtype', 'difficulty', 'domain'])
        self.ds = ds.map(lambda example: {'prompt': format_prompt(example, template_path)}, num_proc=self.num_proc,
                         load_from_cache_file=False)

    def compute_metrics(self, answer_path):
        answers = json.load(open(answer_path))
        self.ds = self.ds.map(
            lambda example: {'true_answer': f'[FEEDBACK] [RESULT] {float(example["criteria_score"])} [END]'},
            num_proc=self.num_proc, load_from_cache_file=False)
        return TextEvaluator.compute_metrics(self.ds['true_answer'], answers)

    def save_prompts(self, save_path):
        os.makedirs(LOG_DIR, exist_ok=True)
        with open(os.path.join(LOG_DIR, save_path), 'w', encoding='utf8') as output:
            json.dump(self.ds['prompt'], output, ensure_ascii=False, indent=4)

    def inference_offline_vllm(self, model_path, tokenizer_path, tensor_parallel_size, answer_path):
        answers = offline_generation(model_path, self.ds['prompt'], tokenizer_path, tensor_parallel_size)
        json.dump(answers, open(os.path.join(LOG_DIR, answer_path), 'w'))

    def inference_offline_vllm_regression(self, model_path, tokenizer_path, tensor_parallel_size, texts_path,
                                          answer_path):
        tokenizer = AutoTokenizer.from_pretrained(tokenizer_path,
                                                  padding="longest",
                                                  padding_side="left", )
        generated_texts = json.load(open(texts_path))
        ds = self.ds.add_column('generated_text', generated_texts)
        ds = ds.map(lambda example: {'pre_tokenized_text': tokenizer.apply_chat_template(
            [
                {"role": "user", "content": example['prompt']},
                {"role": "assistant", "content": example['generated_text']}
            ],
            tokenize=False,
            add_generation_prompt=False
        )}, num_proc=self.num_proc)
        answers = offline_regression(model_path, ds['pre_tokenized_text'], tokenizer_path, tensor_parallel_size)
        json.dump(answers, open(os.path.join(LOG_DIR, answer_path), 'w'))


if __name__ == '__main__':
    fire.Fire(Scoring)
