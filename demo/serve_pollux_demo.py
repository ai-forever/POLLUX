#!/usr/bin/env python3
"""Serve pollux-demo.html and proxy judge requests to a vLLM OpenAI-compatible server.

Start vLLM first (see run_pollux_judge.py), then:
    python serve_pollux_demo.py

Open http://localhost:8765/pollux-demo.html
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import error, request

# Original Pollux prompt (Russian headers, model's native format), kept for easy rollback:
# POINTWISE_TEMPLATE = """### Задание для оценки:
# {instruction}
#
# ### Эталонный ответ:
# {reference_answer}
#
# ### Ответ для оценки:
# {answer}
#
# ### Критерий оценки:
# {criteria_name}
#
# ### Шкала оценивания по критерию:
# {criteria_rubrics}
# """
#
# PAIRWISE_TEMPLATE = """### Инструкция
# Даны два ответа для оценки и шкала их сравнения. Необходимо сравнить ответы по качеству выполнения задания и вернуть число в соответствии со шкалой сравнения ответов.
#
# ### Задание для оценки:
# {instruction}
#
# ### Ответ 1 для оценки:
# {answer_1}
#
# ### Ответ 2 для оценки:
# {answer_2}
#
# ### Шкала сравнения ответов:
# {rubrics}
# """

# Based on https://huggingface.co/ai-forever/Pollux-4B-Judge, headers translated to
# English for this demo (the model's native template uses Russian headers — see the
# commented-out original above for rollback).
POINTWISE_TEMPLATE = """### Task to evaluate:
{instruction}

### Reference answer:
{reference_answer}

### Answer to evaluate:
{answer}

### Evaluation criterion:
{criteria_name}

### Scoring scale for the criterion:
{criteria_rubrics}

Return only one integer from the rubric as the final answer.
"""

# Real pairwise template — no reference_answer, no separate criteria_name; the
# criterion is folded into the rubrics text. Scale: -1 = answer_1 better, 0 = tie, 1 = answer_2 better.
PAIRWISE_TEMPLATE = """### Instructions
Two answers to evaluate and a comparison scale are given. Compare the answers by how well they perform the task.
Return only one integer from the comparison scale as the final answer.

### Task to evaluate:
{instruction}

### Answer 1 to evaluate:
{answer_1}

### Answer 2 to evaluate:
{answer_2}

### Answer comparison scale:
{rubrics}
"""

POINTWISE_REQUIRED_FIELDS = ("instruction", "answer", "criteria_name", "criteria_rubrics")
PAIRWISE_REQUIRED_FIELDS = ("instruction", "answer_1", "answer_2", "rubrics")


def call_kind(row: dict) -> str:
    if "answer_1" in row or "answer_2" in row:
        return "pairwise"
    return "pointwise"


def build_prompt(row: dict) -> str:
    if call_kind(row) == "pairwise":
        return PAIRWISE_TEMPLATE.format(
            instruction=row["instruction"],
            answer_1=row["answer_1"],
            answer_2=row["answer_2"],
            rubrics=row["rubrics"],
        )
    return POINTWISE_TEMPLATE.format(
        instruction=row["instruction"],
        reference_answer=row.get("reference_answer") or "",
        answer=row["answer"],
        criteria_name=row["criteria_name"],
        criteria_rubrics=row["criteria_rubrics"],
    )


def score_row(upstream_base: str, api_key: str, model: str, max_tokens: int, row: dict) -> dict:
    kind = call_kind(row)
    required = PAIRWISE_REQUIRED_FIELDS if kind == "pairwise" else POINTWISE_REQUIRED_FIELDS
    missing = [field for field in required if not row.get(field)]
    if missing:
        raise ValueError(f"Missing required field(s) for {kind} call: {', '.join(missing)}")

    payload = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "user", "content": build_prompt(row)},
            ],
            "max_tokens": max_tokens,
            "temperature": 0.3,
        }
    ).encode("utf-8")
    req = request.Request(
        f"{upstream_base.rstrip('/')}/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    started = time.time()
    try:
        with request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Upstream HTTP {exc.code}: {body[:500]}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Could not reach judge server at {upstream_base}: {exc.reason}") from exc

    message = data["choices"][0]["message"]
    raw_score = (message.get("content") or "").strip()
    reasoning = message.get("reasoning")
    thinking_match = re.search(r"<think>\s*(.*?)\s*</think>", raw_score, re.DOTALL)
    if thinking_match:
        reasoning = reasoning or thinking_match.group(1).strip()
        score_text = re.sub(r"<think>.*?</think>", "", raw_score, flags=re.DOTALL).strip()
    else:
        score_text = raw_score

    try:
        score = int(score_text)
        parse_error = False
    except ValueError:
        trailing_score = re.search(r"(-?\d+)\s*$", score_text)
        if trailing_score:
            score = int(trailing_score.group(1))
            parse_error = False
        else:
            score = None
            parse_error = True

    return {
        **row,
        "score": score,
        "score_raw": raw_score,
        "reasoning": reasoning,
        "parse_error": parse_error,
        "latency_ms": int((time.time() - started) * 1000),
        "model": model,
    }


class DemoHandler(SimpleHTTPRequestHandler):
    upstream_base: str = "http://localhost:8000/v1"
    api_key: str = "EMPTY"
    model: str = "ai-forever/Pollux-4B-Judge"
    max_tokens: int = 512
    workers: int = 4

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self) -> None:
        if self.path != "/api/judge":
            self.send_error(404, "Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            raw_calls = body.get("calls")
            if not isinstance(raw_calls, list) or not raw_calls:
                raise ValueError("Request body must include a non-empty 'calls' array")
            if any(not isinstance(call, dict) for call in raw_calls):
                raise ValueError("Every item in 'calls' must be a JSON object")
            calls = [dict(call) for call in raw_calls]

            results: list[dict] = [{}] * len(calls)
            with ThreadPoolExecutor(max_workers=min(self.workers, len(calls))) as pool:
                futures = {
                    pool.submit(
                        score_row,
                        self.upstream_base,
                        self.api_key,
                        self.model,
                        self.max_tokens,
                        call,
                    ): i
                    for i, call in enumerate(calls)
                }
                for future in as_completed(futures):
                    index = futures[future]
                    try:
                        results[index] = future.result()
                    except Exception as exc:
                        results[index] = {
                            **calls[index],
                            "score": None,
                            "score_raw": None,
                            "reasoning": None,
                            "parse_error": True,
                            "error": str(exc),
                            "latency_ms": None,
                            "model": self.model,
                        }

            payload = json.dumps({"results": results, "model": self.model}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as exc:
            payload = json.dumps({"error": str(exc)}, ensure_ascii=False).encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

    def log_message(self, format: str, *args) -> None:
        sys.stderr.write("%s - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--base-url", default="http://localhost:8000/v1", help="vLLM OpenAI-compatible server URL")
    parser.add_argument("--api-key", default="EMPTY")
    parser.add_argument("--model", default="ai-forever/Pollux-4B-Judge")
    parser.add_argument("--max-tokens", type=int, default=512)
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()

    demo_dir = Path(__file__).resolve().parent
    handler_class = type(
        "ConfiguredDemoHandler",
        (DemoHandler,),
        {
            "upstream_base": args.base_url,
            "api_key": args.api_key,
            "model": args.model,
            "max_tokens": args.max_tokens,
            "workers": args.workers,
        },
    )
    handler = partial(handler_class, directory=str(demo_dir))

    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving demo from {demo_dir}", file=sys.stderr)
    print(f"Judge proxy -> {args.base_url} ({args.model})", file=sys.stderr)
    print(f"Open http://{args.host}:{args.port}/pollux-demo.html", file=sys.stderr)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.", file=sys.stderr)


if __name__ == "__main__":
    main()
