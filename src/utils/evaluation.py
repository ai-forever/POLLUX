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


class LossMetric:
    def __init__(self):
        self.loss = 0
        self.n = 0

    def add_batch(self, inputs: EvalPrediction, step):
        self.loss += inputs.losses.sum().item()
        self.n += len(inputs.losses)

    def compute(self):
        return {"eval_loss": self.loss / self.n}


class PolluxMetric:
    def __init__(self, tokenizer):
        self.metrics = defaultdict(int)
        self.n = 0
        self.tokenizer = tokenizer
        self.true_texts = None
        self.pred_texts = None

    def add_batch(self, inputs: EvalPrediction, step):
        self.metrics["loss"] += inputs.losses.sum().item()
        batch_size = len(inputs.losses)
        self.n += batch_size
        preds = inputs.predictions
        preds[preds == -100] = self.tokenizer.pad_token_id
        labels = inputs.label_ids
        labels[labels == -100] = self.tokenizer.pad_token_id
        self.pred_texts = self.tokenizer.batch_decode(preds, skip_special_tokens=True)
        self.true_texts = self.tokenizer.batch_decode(labels, skip_special_tokens=True)
        batch_metrics = TextEvaluator.compute_metrics(self.true_texts, self.pred_texts)
        for k, v in batch_metrics.items():
            self.metrics[k] += v * batch_size

    def compute(self):
        computed_metrics = {}
        for k, v in self.metrics.items():
            computed_metrics["eval_" + k] = v / self.n
        return computed_metrics

    @property
    def texts(self):
        return {"true": self.true_texts, "pred": self.pred_texts}
