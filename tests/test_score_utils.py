import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from utils.score_utils import (  # noqa: E402
    extract_score,
    is_binary_scale,
    normalize_score,
    parse_scale_bounds,
    score_is_within_scale,
)


class ScoreUtilsTest(unittest.TestCase):
    def test_extracts_multi_digit_decimal_score(self):
        self.assertEqual(extract_score("[RESULT] 10.5 [END]"), 10.5)

    def test_extracts_decimal_comma_score(self):
        self.assertEqual(extract_score("[RESULT] 3,5 [END]"), 3.5)

    def test_extracts_negative_score(self):
        self.assertEqual(extract_score("[RESULT] -2 [END]"), -2.0)

    def test_requires_complete_result_block(self):
        self.assertIsNone(extract_score("[RESULT] 4"))

    def test_parses_bounds_from_text_scale(self):
        rubrics = "1: Плохо\n\n3: Средне\n\n5: Отлично"
        self.assertEqual(parse_scale_bounds(rubrics), (1.0, 5.0))

    def test_parses_prompt_scale_template(self):
        prompt = """### Задание для оценки:
{instruction}

### Эталонный ответ:
{reference_answer}

### Ответ для оценки:
{answer}

### Критерий оценки:
{criteria_name}

### Шкала оценивания по критерию:
0: Предложение модели применимо только в одном случае либо не применимо вообще.
1: Предложение модели адаптировано под узкий спектр похожих ситуаций.
2: Предложение модели универсально и адаптировано под разные обстоятельства."""
        self.assertEqual(parse_scale_bounds(prompt), (0.0, 2.0))
        self.assertTrue(score_is_within_scale(2, prompt))
        self.assertFalse(score_is_within_scale(3, prompt))

    def test_parses_ascii_hyphen_scale(self):
        rubrics = "0 - Poor\n5 - Excellent"
        self.assertEqual(parse_scale_bounds(rubrics), (0.0, 5.0))

    def test_parses_named_range(self):
        self.assertEqual(
            parse_scale_bounds("Оцените по шкале от 1 до 10."),
            (1.0, 10.0),
        )

    def test_parses_bounds_from_nested_scale(self):
        rubrics = {"ru": {"-2": "Плохо", "0": "Средне", "2": "Хорошо"}}
        self.assertEqual(parse_scale_bounds(rubrics), (-2.0, 2.0))

    def test_accepts_score_above_two_when_scale_allows_it(self):
        rubrics = "1 — Плохо\n2 — Средне\n3 — Хорошо\n4 — Отлично"
        self.assertTrue(score_is_within_scale(4, rubrics))

    def test_rejects_score_outside_scale(self):
        rubrics = "1: Плохо\n2: Средне\n3: Отлично"
        self.assertFalse(score_is_within_scale(4, rubrics))

    def test_missing_scale_does_not_remove_valid_score(self):
        self.assertTrue(score_is_within_scale(4, None))

    def test_binary_scale_requires_exact_zero_and_one_values(self):
        self.assertTrue(is_binary_scale("0: Pass\n1: Reject"))
        self.assertFalse(is_binary_scale("1: Poor\n5: Excellent"))
        self.assertFalse(is_binary_scale("0: Poor\n1: Average\n2: Excellent"))

    def test_normalizes_score_by_scale_maximum(self):
        self.assertEqual(normalize_score(4, "1: Poor\n5: Excellent"), 0.8)

    def test_rejects_normalization_when_scale_maximum_is_zero(self):
        with self.assertRaisesRegex(ValueError, "maximum is 0"):
            normalize_score(0, "-1: Poor\n0: Excellent")


if __name__ == "__main__":
    unittest.main()
