# POLLUX Judge — demo web app

- **`pollux-demo.html`** — the UI. Four interactive scenarios (Pointwise, RAG
  Faithfulness, Side-by-Side, Agent / Tool-use) plus a Batch Report view for
  scoring JSONL files and comparing judges.
- **`serve_pollux_demo.py`** — a small HTTP server that serves
  `pollux-demo.html` and proxies the page's "Run Judge" calls to an
  OpenAI-compatible judge backend.

## Requirements

- Python 3.9+.
- A running OpenAI-compatible judge server (e.g. vLLM serving
  `ai-forever/Pollux-4B-Judge`) for the **Run Judge** button to work.

## Run it

1. Start the judge backend:
   ```
   vllm serve ai-forever/Pollux-4B-Judge --tensor-parallel-size 1 --reasoning-parser qwen3
   ```
2. Start the demo server (from this directory):
   ```
   python serve_pollux_demo.py
   ```
3. Open **http://localhost:8765/pollux-demo.html**

## Options

`serve_pollux_demo.py` flags (all optional):

| Flag | Default | Purpose |
|---|---|---|
| `--host` | `127.0.0.1` | Host to bind |
| `--port` | `8765` | Port to serve the demo page on |
| `--base-url` | `http://localhost:8000/v1` | OpenAI-compatible judge server URL |
| `--api-key` | `EMPTY` | API key sent to the judge server |
| `--model` | `ai-forever/Pollux-4B-Judge` | Model name sent in judge requests |
| `--max-tokens` | `512` | Max tokens per judge response |
| `--workers` | `4` | Parallel workers for batch scoring |

Point `--base-url` at any OpenAI-compatible `/chat/completions` endpoint to
use a different judge backend — the prompt templates aren't Pollux-specific
at the API level.
