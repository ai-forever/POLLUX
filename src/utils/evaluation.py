import re
from collections import defaultdict

import numpy as np
from transformers import EvalPrediction, StoppingCriteria


class StopOnSubstring(StoppingCriteria):
    def __init__(self, tokenizer, stop_text):
        self.tokenizer = tokenizer
        self.stop_text = stop_text

    def __call__(self, input_ids, scores, **kwargs):
        decoded_text = self.tokenizer.decode(input_ids[0], skip_special_tokens=True)
        return decoded_text.endswith(self.stop_text)


class TextEvaluator:
    @staticmethod
    def check_format(text):
        format_pattern = r"\[SCORE\] \d \[END\]"
        search = re.search(format_pattern, text)
        return search, ""

    @staticmethod
    def extract_score(text):
        res = re.search("(?<=\[RESULT\] )\s*\d+\.\d+", text)
        if res is not None:
            return float(res.group(0).strip())
        else:
            res = re.search("(?<=\[RESULT\] )\s*\d", text)
            if res is not None:
                return float(res.group(0).strip())
            else:
                return None

    @staticmethod
    def extract_criteria_name(prompt):
        res = re.search(r"(?<=### Score name\n)[^\n]+(?=\n)", prompt)
        return res.group(0) if res else None

    @staticmethod
    def extract_score_rubrics(prompt):
        res = re.search(r"(?<=### Score Rubrics:\n)[^#]+(?=### Feedback)", prompt)
        if res:
            rubrics_text = res.group(0)
            rubrics = [re.split(r"(?<=\d) ?[:—] ", r) for r in re.split(r"\n\n(?=\d)", rubrics_text)]
            return rubrics
        return None

    @staticmethod
    def compute_metrics(true_array, pred_array):
        metrics = {
            "format_acc": [],
            "score_acc": [],
            "score_format_acc": [],
        }
        scores = {
            "true_all": [],
            "pred_all": [],
        }
        for true, pred in zip(true_array, pred_array):
            true_score = true if isinstance(true, int) else TextEvaluator.extract_score(true)
            if true_score is None:
                print("`compute_metrics()`: No score key in true score. Skipped sample.")
                continue
            pred_score = TextEvaluator.extract_score(pred)
            scores["true_all"].append(true_score)
            scores["pred_all"].append(pred_score)

            if pred_score is not None:
                metrics["format_acc"].append(1)
                metrics["score_acc"].append(int(true_score == pred_score))
                metrics["score_format_acc"].append(int(true_score == pred_score))
            else:
                metrics["format_acc"].append(0)
                metrics["score_acc"].append(0)

        for k, v in metrics.items():
            metrics[k] = sum(v) / len(v) if v else 0

        pred_is_none_mask = np.array([bool(p is None) for p in scores["pred_all"]])
        true_filtered = np.array(scores["true_all"])[~pred_is_none_mask]
        pred_filtered = np.array(scores["pred_all"])[~pred_is_none_mask]
        metrics["mse"] = np.mean((np.array(true_filtered) - np.array(pred_filtered))**2)

        return metrics