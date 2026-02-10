import json
from pathlib import Path
from typing import Literal, Optional

import datasets
import typer

from utils.backend_runner import run_backend
from utils.format_prompt import format_prompt


RESULTS_DIR = "results"
TEST_DATASET_ID = "ai-forever/POLLUX-instructions"

app = typer.Typer()


class ScoreRunner:
    def __init__(
        self,
        model_name: str,
        test_path: str,
        split: str,
        template_path: str,
        results_dir: Path = Path(RESULTS_DIR),
        backend: Literal["openai", "vllm"] = "openai",
        judge_model: str = "gpt-4o",
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        max_tokens: int = 1024,
        temperature: float = 0.0,
        concurrency: int = 10,
        num_proc: int = 1,
        tokenizer_path: Optional[str] = None,
        tensor_parallel_size: int = 1,
    ):
        self.model_name = model_name
        self.test_path = test_path
        self.template_path = template_path
        self.results_dir = Path(results_dir)
        self.answers_path = self.results_dir / model_name.replace("/", "-").strip() / "answers.json"
        self.backend = backend
        self.judge_model = judge_model
        self.api_key = api_key
        self.base_url = base_url
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.concurrency = concurrency
        self.num_proc = num_proc
        self.tokenizer_path = tokenizer_path or judge_model
        self.tensor_parallel_size = tensor_parallel_size

        self._prompts: list[str] = []
        self._samples: list[dict] = []
        self._sample_meta: list[dict] = []
        self._ds = None
        self.split = split

    def _load_dataset_and_prompts(self) -> None:
        ds = datasets.load_dataset(self.test_path)[self.split]
        if not self.answers_path.exists():
            raise FileNotFoundError(f"Answers not found: {self.answers_path}. Run answer.py for model '{self.model_name}' first.")
        with open(self.answers_path, encoding="utf-8") as f:
            payload = json.load(f)
        answers = payload.get("answers", payload) if isinstance(payload, dict) else payload
        if answers and isinstance(answers[0], dict) and "prompt_id" in answers[0]:
            id2answer = {a["prompt_id"]: a["answer"] for a in answers}
        else:
            if len(answers) != len(ds):
                raise ValueError(
                    f"Answers length ({len(answers)}) does not match dataset size ({len(ds)})"
                )
            id2answer = {ds[i]["prompt_id"]: answers[i] for i in range(len(ds))}
        samples: list[dict] = []
        sample_meta: list[dict] = []
        for row in ds:
            prompt_id = row["prompt_id"]
            answer = id2answer.get(prompt_id)
            if answer is None:
                continue
            ref = row.get("reference_answer") or ""
            for crit in row.get("criteria") or []:
                sample = {
                    "instruction": row["instruction"],
                    "reference_answer": ref,
                    "answer": answer,
                    "criteria_name": crit.get("criteria_name", ""),
                    "rubrics": crit.get("rubrics", ""),
                }
                samples.append(sample)
                sample_meta.append({"prompt_id": prompt_id, "criteria_name": sample["criteria_name"]})
        self._samples = samples
        self._sample_meta = sample_meta
        self._prompts = [format_prompt(s, self.template_path) for s in samples]
        self._ds = ds

    def run(self, output_name: str = "scores.json") -> Path:
        self._load_dataset_and_prompts()
        raw_responses = run_backend(
            self.backend,
            self._prompts,
            self.judge_model,
            api_key=self.api_key,
            base_url=self.base_url,
            tokenizer_path=self.tokenizer_path,
            tensor_parallel_size=self.tensor_parallel_size,
            max_tokens=self.max_tokens,
            temperature=self.temperature,
            concurrency=self.concurrency,
            openai_messages_fn=lambda p: [
                {"role": "user", "content": p},
            ],
            desc="Judge",
        )

        scores_payload = [
            {"response": r, "meta": m}
            for r, m in zip(raw_responses, self._sample_meta)
        ]

        out_dir = self.results_dir / self.model_name.replace("/", "-").strip()
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / output_name
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(scores_payload, f, ensure_ascii=False, indent=2)

        return out_file


@app.command()
def main(
    model_name: str = typer.Argument(..., help="Model name (folder results/<model_name> with answers.json)"),
    test_path: str = typer.Option(TEST_DATASET_ID, "--test-path", "-d", help="Dataset path or HuggingFace id"),
    split: str = typer.Option("train", "--split", help="Dataset split name (e.g. train, test)"),
    template_path: str = typer.Option(
        "prompts/test_pollux.txt",
        "--template", "-t",
        help="Prompt template file path",
    ),
    results_dir: Path = typer.Option(RESULTS_DIR, "--results-dir", "-o", path_type=Path),
    backend: Literal["openai", "vllm"] = typer.Option("openai", "--backend", "-b", help="openai or vllm (offline)"),
    judge_model: str = typer.Option("gpt-4o", "--judge-model", "-m"),
    api_key: Optional[str] = typer.Option(None, "--api-key", envvar="OPENAI_API_KEY"),
    base_url: Optional[str] = typer.Option(None, "--base-url"),
    max_tokens: int = typer.Option(1024, "--max-tokens"),
    temperature: float = typer.Option(0.0, "--temperature"),
    concurrency: int = typer.Option(10, "--concurrency", "-c", help="Max concurrent requests (openai only)"),
    tokenizer_path: Optional[str] = typer.Option(None, "--tokenizer", help="Tokenizer path (vllm only, default: judge-model)"),
    tensor_parallel_size: int = typer.Option(1, "--tensor-parallel-size"),
    output: str = typer.Option("scores.json", "--output", "-O"),
) -> None:
    if backend == "openai" and not api_key:
        raise typer.BadParameter("Set OPENAI_API_KEY in env or use --api-key")

    runner = ScoreRunner(
        model_name=model_name,
        test_path=test_path,
        split=split,
        template_path=template_path,
        results_dir=results_dir,
        backend=backend,
        judge_model=judge_model,
        api_key=api_key,
        base_url=base_url,
        max_tokens=max_tokens,
        temperature=temperature,
        concurrency=concurrency,
        tokenizer_path=tokenizer_path,
        tensor_parallel_size=tensor_parallel_size,
    )
    out_file = runner.run(output_name=output)
    typer.echo(f"Saved {len(runner._prompts)} scores to {out_file}")


if __name__ == "__main__":
    app()
