import json
import re
from pathlib import Path
from typing import Literal, Optional

import datasets
import typer

from utils.backend_runner import run_backend

RESULTS_DIR = "results"
DATASET_ID = "ai-forever/POLLUX-instructions"

app = typer.Typer()


def strip_think_tags(text: str) -> str:
    """Remove <think>...</think> blocks and any trailing <think> without </think>. Return trimmed result."""
    if not text:
        return text
    out = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    out = re.sub(r"<think>.*", "", out, flags=re.DOTALL)
    return out.strip()


class AnswerRunner:
    def __init__(
        self,
        dataset: str = DATASET_ID,
        split: Optional[str] = None,
        model: str = "gpt-4o",
        results_dir: Path = Path(RESULTS_DIR),
        backend: Literal["openai", "vllm"] = "openai",
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        concurrency: int = 10,
        tokenizer_path: Optional[str] = None,
        tensor_parallel_size: int = 1,
        meta_filter: Optional[str] = None,
    ):
        self.dataset = dataset
        self.split = split
        self.meta_filter = meta_filter
        self.model = model
        self.results_dir = Path(results_dir)
        self.backend = backend
        self.api_key = api_key
        self.base_url = base_url
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.concurrency = concurrency
        self.tokenizer_path = tokenizer_path or model
        self.tensor_parallel_size = tensor_parallel_size

        self._instructions: list[str] = []
        self._prompt_ids: list[int] = []
        self._split_name: str = ""

    def _model_results_dir(self) -> Path:
        """Results directory for the model: results/<model_name>."""
        name = self.model.replace("/", "-").strip()
        return self.results_dir / name

    def _load_instructions(self) -> None:
        ds = datasets.load_dataset(self.dataset)
        self._split_name = self.split or "train"
        ds = ds[self._split_name]
        if "instruction" not in ds.column_names:
            raise ValueError(f"Dataset has no 'instruction' column. Columns: {ds.column_names}")
        if self.meta_filter is not None:
            if "meta" not in ds.column_names:
                raise ValueError(f"Dataset has no 'meta' column for --meta filter. Columns: {ds.column_names}")
            mask = [m == self.meta_filter for m in ds["meta"]]
            indices = [i for i, b in enumerate(mask) if b]
            if not indices:
                raise ValueError(f"No prompts with meta={self.meta_filter!r}. Check dataset meta values.")
            self._instructions = [ds["instruction"][i] for i in indices]
            self._prompt_ids = [ds["prompt_id"][i] for i in indices] if "prompt_id" in ds.column_names else indices
        else:
            self._instructions = list(ds["instruction"])
            self._prompt_ids = list(ds["prompt_id"]) if "prompt_id" in ds.column_names else list(range(len(self._instructions)))

    def run(self) -> Path:
        self._load_instructions()
        
        answers = run_backend(
            self.backend,
            self._instructions,
            self.model,
            api_key=self.api_key,
            base_url=self.base_url,
            tokenizer_path=self.tokenizer_path,
            tensor_parallel_size=self.tensor_parallel_size,
            max_tokens=self.max_tokens,
            temperature=self.temperature,
            concurrency=self.concurrency,
            openai_messages_fn=lambda instr: [{"role": "user", "content": instr}],
            desc="Answers",
        )

        out_dir = self._model_results_dir()
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "answers.json"
        new_answers = [
            {"prompt_id": pid, "answer": strip_think_tags(ans)}
            for pid, ans in zip(self._prompt_ids, answers)
        ]
        if self.meta_filter is not None and out_file.exists():
            with open(out_file, encoding="utf-8") as f:
                payload = json.load(f)
            existing = payload.get("answers", [])
            if not existing:
                id2answer = {}
            elif isinstance(existing[0], dict) and "prompt_id" in existing[0]:
                id2answer = {a["prompt_id"]: a["answer"] for a in existing}
            else:
                ds = datasets.load_dataset(self.dataset)[self._split_name]
                prompt_ids = ds["prompt_id"] if "prompt_id" in ds.column_names else list(range(len(existing)))
                id2answer = {prompt_ids[i]: existing[i] for i in range(min(len(prompt_ids), len(existing)))}
            for item in new_answers:
                id2answer[item["prompt_id"]] = item["answer"]
            answers_with_ids = [{"prompt_id": pid, "answer": ans} for pid, ans in sorted(id2answer.items())]
        else:
            answers_with_ids = new_answers
        payload = {
            "model": self.model,
            "dataset": self.dataset,
            "split": self._split_name,
            "num_samples": len(answers_with_ids),
            "answers": answers_with_ids,
        }
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        return out_file


@app.command()
def main(
    dataset: str = typer.Option(DATASET_ID, "--dataset", "-d"),
    split: Optional[str] = typer.Option(None, "--split", "-s"),
    model: str = typer.Option("gpt-4o", "--model", "-m"),
    results_dir: Path = typer.Option(RESULTS_DIR, "--results-dir", "-o", path_type=Path),
    backend: Literal["openai", "vllm"] = typer.Option("openai", "--backend", "-b", help="openai or vllm (offline)"),
    api_key: Optional[str] = typer.Option(None, "--api-key", envvar="OPENAI_API_KEY"),
    base_url: Optional[str] = typer.Option(None, "--base-url"),
    max_tokens: int = typer.Option(4096, "--max-tokens"),
    temperature: float = typer.Option(0.7, "--temperature"),
    concurrency: int = typer.Option(10, "--concurrency", "-c", help="Max concurrent requests (openai only)"),
    tokenizer_path: Optional[str] = typer.Option(None, "--tokenizer", help="Tokenizer path (vllm only, default: model)"),
    tensor_parallel_size: int = typer.Option(1, "--tensor-parallel-size", help="vLLM tensor parallel size"),
    meta: Optional[str] = typer.Option(None, "--meta", "-M", help="Run only prompts where meta column equals this value (default: all)"),
) -> None:
    if backend == "openai" and not api_key:
        raise typer.BadParameter("Set OPENAI_API_KEY in env or use --api-key")

    runner = AnswerRunner(
        dataset=dataset,
        split=split,
        model=model,
        results_dir=results_dir,
        backend=backend,
        api_key=api_key,
        base_url=base_url,
        max_tokens=max_tokens,
        temperature=temperature,
        concurrency=concurrency,
        tokenizer_path=tokenizer_path,
        tensor_parallel_size=tensor_parallel_size,
        meta_filter=meta,
    )
    out_file = runner.run()
    typer.echo(f"Saved {len(runner._instructions)} answers to {out_file}")


if __name__ == "__main__":
    app()
