"""
Parse llm-as-a-judge responses from scores.json into numbers.
Builds a matrix CSV: columns = dataset meta, rows = criteria_name, cells = mean score.
Adds column with mean over all meta (per criteria) and row with mean over all criteria (per meta).
Judge response format: [FEEDBACK] some text [RESULT] <score> [END]
"""

import json
import re
from pathlib import Path
from typing import Optional

import datasets
import pandas as pd
import typer

RESULTS_DIR = "results"
TEST_DATASET_ID = "ai-forever/POLLUX-instructions"

app = typer.Typer()

RESULT_PATTERN = re.compile(r"\[RESULT\]\s*([^\s\[]+)\s*\[END\]", re.IGNORECASE | re.DOTALL)
RUBRIC_LEVELS = re.compile(r"(\d+)\s*:")


def count_rubric_levels(rubrics: str) -> int:
    """Number of distinct score levels in rubrics text (e.g. '0: ... 1: ...' -> 2)."""
    if not rubrics or not isinstance(rubrics, str):
        return 0
    return len(set(RUBRIC_LEVELS.findall(rubrics)))


def parse_score(response: str) -> float | None:
    """Extract numeric score from judge response. Returns None on parse error."""
    if not response or not isinstance(response, str):
        return None
    match = RESULT_PATTERN.search(response)
    if not match:
        return None
    raw = match.group(1).strip()
    try:
        return float(raw.replace(",", "."))
    except ValueError:
        return None


def run(
    model_name: str,
    results_dir: Path,
    scores_filename: str = "scores.json",
    dataset_path: Optional[str] = None,
    split: str = "train",
) -> tuple[Path, float | None]:
    model_dir = results_dir / model_name.replace("/", "-").strip()
    scores_path = model_dir / scores_filename
    if not scores_path.exists():
        raise FileNotFoundError(f"Scores not found: {scores_path}. Run score.py first.")

    id2meta: dict[int, str] = {}
    binary_criteria: set[tuple[str, str]] = set()
    if dataset_path:
        ds = datasets.load_dataset(dataset_path)[split]
        ddf = ds.to_pandas()
        if "prompt_id" in ddf.columns and "meta" in ddf.columns:
            id2meta = ddf.set_index("prompt_id")["meta"].fillna("").astype(str).to_dict()
        if "meta" in ddf.columns and "criteria" in ddf.columns:
            for _, row in ddf.iterrows():
                meta = "" if row["meta"] is None else str(row["meta"])
                for c in row.get("criteria"):
                    name = c.get("criteria_name") or ""
                    if count_rubric_levels(c.get("rubrics") or "") == 2:
                        binary_criteria.add((meta, name))

    with open(scores_path, encoding="utf-8") as f:
        data = json.load(f)

    rows = data if isinstance(data, list) else []
    parsed = []
    for item in rows:
        if isinstance(item, dict):
            resp = item.get("response", item.get("raw", ""))
            meta_val = item.get("meta")
            score = parse_score(resp if isinstance(resp, str) else str(resp))
            if score is None:
                continue
            if isinstance(meta_val, dict) and "prompt_id" in meta_val:
                prompt_id = meta_val["prompt_id"]
                meta_key = id2meta.get(prompt_id, "")
                criteria_name = meta_val.get("criteria_name", "")
            elif meta_val is not None and not isinstance(meta_val, dict):
                prompt_id = None
                meta_key = str(meta_val)
                criteria_name = ""
            else:
                prompt_id = None
                meta_key = ""
                criteria_name = ""
            is_binary = (meta_key, criteria_name) in binary_criteria
            parsed.append({"prompt_id": prompt_id, "meta": meta_key, "criteria_name": criteria_name, "score": score, "is_binary": is_binary})
        elif isinstance(item, str):
            score = parse_score(item)
            if score is not None:
                parsed.append({"prompt_id": None, "meta": "", "criteria_name": "", "score": score, "is_binary": False})

    if not parsed:
        raise ValueError("No valid scores parsed from scores.json (expected [RESULT] <score> [END]).")

    df = pd.DataFrame(parsed)
    if "prompt_id" in df.columns:
        binary_ones = df[(df["is_binary"]) & (df["score"] == 1)]["prompt_id"].dropna().unique()
        if len(binary_ones):
            df.loc[df["prompt_id"].isin(binary_ones), "score"] = 0
    df = df.drop(columns=["prompt_id"], errors="ignore")
    matrix = df.pivot_table(
        index="criteria_name", columns="meta", values="score", aggfunc="mean", sort=True
    )
    matrix["mean_over_meta"] = matrix.mean(axis=1)
    non_binary_df = df[~df["is_binary"]]
    grand_mean = float(non_binary_df["score"].mean()) if len(non_binary_df) else None

    mean_over_criteria_vals = {}
    for col in matrix.columns:
        if col == "mean_over_meta":
            mean_over_criteria_vals[col] = grand_mean
            continue
        non_binary_rows = [idx for idx in matrix.index if (col, idx) not in binary_criteria]
        if non_binary_rows:
            mean_over_criteria_vals[col] = matrix.loc[non_binary_rows, col].mean()
        else:
            mean_over_criteria_vals[col] = pd.NA
    matrix.loc["mean_over_criteria"] = mean_over_criteria_vals

    out_file = model_dir / "metrics.csv"
    matrix.to_csv(out_file, encoding="utf-8")

    return out_file, grand_mean


@app.command()
def main(
    model_name: str = typer.Argument(..., help="Model name (folder results/<model_name> with scores.json)"),
    results_dir: Path = typer.Option(RESULTS_DIR, "--results-dir", "-o", path_type=Path),
    scores_file: str = typer.Option("scores.json", "--scores", "-s", help="Scores filename in the model folder"),
    dataset_path: Optional[str] = typer.Option(TEST_DATASET_ID, "--dataset", "-d", help="Dataset to get meta column (for grouping)"),
    split: str = typer.Option("train", "--split", help="Dataset split name"),
) -> None:
    out_file, grand_mean = run(
        model_name,
        results_dir,
        scores_filename=scores_file,
        dataset_path=dataset_path,
        split=split,
    )
    typer.echo(f"Saved metrics to {out_file}")
    if grand_mean is not None:
        typer.echo(f"Grand mean (all criteria excluding binary, all meta): {grand_mean:.4f}")


if __name__ == "__main__":
    app()
