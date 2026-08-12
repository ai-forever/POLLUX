import json
import sys
import unittest
from pathlib import Path
from unittest.mock import mock_open, patch

import pandas as pd


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

import metrics  # noqa: E402


class _Dataset:
    def __init__(self, rows):
        self._frame = pd.DataFrame(rows)

    def to_pandas(self):
        return self._frame


class MetricsTest(unittest.TestCase):
    def run_metrics(self, dataset_rows, scores):
        dataset = _Dataset(dataset_rows)
        with (
            patch.object(Path, "exists", return_value=True),
            patch("metrics.open", mock_open(read_data=json.dumps(scores))),
            patch.object(pd.DataFrame, "to_csv", autospec=True) as to_csv,
            patch.object(
                metrics.datasets,
                "load_dataset",
                return_value={"train": dataset},
            ),
        ):
            _, grand_mean = metrics.run(
                "model",
                Path("results"),
                dataset_path="dataset",
            )

        return to_csv.call_args.args[0], grand_mean

    def test_keeps_score_above_two_when_rubric_allows_it(self):
        # Two declared endpoints do not necessarily mean a binary 0/1 scale.
        rubrics = "1: Poor\n5: Excellent"
        dataset_rows = [
            {
                "prompt_id": 1,
                "meta": "general",
                "criteria": [
                    {"criteria_name": "quality", "rubrics": rubrics}
                ],
            },
            {
                "prompt_id": 2,
                "meta": "general",
                "criteria": [
                    {"criteria_name": "quality", "rubrics": rubrics}
                ],
            },
        ]
        scores = [
            {
                "response": "[FEEDBACK] ok [RESULT] 4 [END]",
                "meta": {"prompt_id": 1, "criteria_name": "quality"},
            },
            {
                "response": "[FEEDBACK] invalid [RESULT] 6 [END]",
                "meta": {"prompt_id": 2, "criteria_name": "quality"},
            },
        ]

        matrix, grand_mean = self.run_metrics(dataset_rows, scores)

        self.assertEqual(matrix.loc["quality", "general"], 0.75)
        self.assertEqual(grand_mean, 0.75)

    def test_binary_zero_allows_normalized_scores(self):
        dataset_rows = [
            {
                "prompt_id": 1,
                "meta": "general",
                "criteria": [
                    {"criteria_name": "gate", "rubrics": "0: Pass\n1: Reject"},
                    {
                        "criteria_name": "quality",
                        "rubrics": "0: Poor\n2: Excellent",
                    },
                ],
            }
        ]
        scores = [
            {
                "response": "[FEEDBACK] pass [RESULT] 0 [END]",
                "meta": {"prompt_id": 1, "criteria_name": "gate"},
            },
            {
                "response": "[FEEDBACK] ok [RESULT] 1 [END]",
                "meta": {"prompt_id": 1, "criteria_name": "quality"},
            },
        ]

        matrix, grand_mean = self.run_metrics(dataset_rows, scores)

        self.assertEqual(matrix.loc["quality", "general"], 0.5)
        self.assertEqual(grand_mean, 0.5)

    def test_binary_one_zeros_remaining_scores(self):
        dataset_rows = [
            {
                "prompt_id": 1,
                "meta": "general",
                "criteria": [
                    {"criteria_name": "gate", "rubrics": "0: Pass\n1: Reject"},
                    {
                        "criteria_name": "quality",
                        "rubrics": "0: Poor\n2: Excellent",
                    },
                ],
            }
        ]
        scores = [
            {
                "response": "[FEEDBACK] reject [RESULT] 1 [END]",
                "meta": {"prompt_id": 1, "criteria_name": "gate"},
            },
            {
                "response": "[FEEDBACK] excellent [RESULT] 2 [END]",
                "meta": {"prompt_id": 1, "criteria_name": "quality"},
            },
        ]

        matrix, grand_mean = self.run_metrics(dataset_rows, scores)

        self.assertEqual(matrix.loc["quality", "general"], 0.0)
        self.assertEqual(grand_mean, 0.0)


if __name__ == "__main__":
    unittest.main()
