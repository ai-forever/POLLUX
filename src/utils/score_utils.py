import re
from collections.abc import Mapping, Sequence
from typing import Any


NUMBER_PATTERN = r"[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)"
RESULT_SCORE_PATTERN = re.compile(
    rf"\[RESULT\]\s*({NUMBER_PATTERN})\s*\[END\]",
    re.IGNORECASE,
)
RUBRIC_SCORE_PATTERN = re.compile(
    rf"^\s*(?:[-*•]\s+)?({NUMBER_PATTERN})\s*(?::|[—–]|\.(?=\s)|\)|-(?=\s))",
    re.MULTILINE,
)
NAMED_RANGE_PATTERN = re.compile(
    rf"(?:от|from)\s+({NUMBER_PATTERN})\s+(?:до|to)\s+({NUMBER_PATTERN})",
    re.IGNORECASE,
)
SCALE_RANGE_PATTERN = re.compile(
    rf"(?:шкала|scale)[^\n]*?({NUMBER_PATTERN})\s*(?:\.\.|…|[—–-])\s*({NUMBER_PATTERN})",
    re.IGNORECASE,
)


def parse_number(value: Any) -> float | None:
    try:
        return float(str(value).strip().replace(",", "."))
    except (TypeError, ValueError):
        return None


def extract_score(text: str) -> float | None:
    """Extract a numeric value from a complete ``[RESULT] ... [END]`` block."""
    if not isinstance(text, str):
        return None

    match = RESULT_SCORE_PATTERN.search(text)
    return parse_number(match.group(1)) if match else None


def parse_scale_values(rubrics: Any) -> list[float]:
    """Extract score values declared by a textual or structured rubric."""
    if isinstance(rubrics, Mapping):
        key_scores = [
            score
            for key in rubrics
            if (score := parse_number(key)) is not None
        ]
        if key_scores:
            return key_scores

        scores: list[float] = []
        for value in rubrics.values():
            scores.extend(parse_scale_values(value))
        return scores

    if isinstance(rubrics, str):
        scores = [
            score
            for match in RUBRIC_SCORE_PATTERN.finditer(rubrics)
            if (score := parse_number(match.group(1))) is not None
        ]
        if scores:
            return scores

        for pattern in (NAMED_RANGE_PATTERN, SCALE_RANGE_PATTERN):
            match = pattern.search(rubrics)
            if match:
                return [
                    score
                    for group in match.groups()
                    if (score := parse_number(group)) is not None
                ]
        return []

    if isinstance(rubrics, Sequence) and not isinstance(rubrics, (bytes, bytearray)):
        scores = []
        for value in rubrics:
            scores.extend(parse_scale_values(value))
        return scores

    score = parse_number(rubrics)
    return [score] if score is not None else []


def parse_scale_bounds(rubrics: Any) -> tuple[float, float] | None:
    """Return the minimum and maximum values declared by an evaluation scale."""
    scores = parse_scale_values(rubrics)
    if not scores:
        return None
    return min(scores), max(scores)


def is_binary_scale(rubrics: Any) -> bool:
    """Return whether the rubric declares exactly the two values 0 and 1."""
    return set(parse_scale_values(rubrics)) == {0.0, 1.0}


def score_is_within_scale(score: Any, rubrics: Any) -> bool:
    """Check a score against its rubric without assuming a fixed 0–2 scale."""
    parsed_score = parse_number(score)
    if parsed_score is None:
        return False

    bounds = parse_scale_bounds(rubrics)
    if bounds is None:
        # Missing scale metadata must not discard an otherwise valid score.
        return True

    minimum, maximum = bounds
    return minimum <= parsed_score <= maximum


def normalize_score(score: Any, rubrics: Any) -> float | None:
    """Normalize a score to 0–1 using the rubric's minimum and maximum."""
    parsed_score = parse_number(score)
    if parsed_score is None:
        return None

    bounds = parse_scale_bounds(rubrics)
    if bounds is None:
        # Keep old score files usable when rubric metadata is unavailable.
        return parsed_score

    minimum, maximum = bounds
    scale_range = maximum - minimum
    if scale_range == 0:
        raise ValueError("Cannot normalize a score from a scale with no range")
    return (parsed_score - minimum) / scale_range
