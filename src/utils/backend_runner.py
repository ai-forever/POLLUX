from typing import Callable, Literal, Optional

from utils.openai_runner import build_client, run_async



def run_backend(
    backend: Literal["openai", "vllm"],
    items: list[str],
    model: str,
    *,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    tokenizer_path: Optional[str] = None,
    tensor_parallel_size: int = 1,
    max_tokens: int = 4096,
    temperature: float = 0.7,
    concurrency: int = 10,
    openai_messages_fn: Optional[Callable[[str], list[dict]]] = None,
    desc: str = "",
) -> list[str]:
    if backend == "vllm":
        from utils.vllm_runner import offline_generation
        messages_fn = openai_messages_fn or (lambda x: [{"role": "user", "content": x}])
        dialogues = [messages_fn(item) for item in items]
        return offline_generation(
            model,
            dialogues,
            tokenizer_path or model,
            tensor_parallel_size=tensor_parallel_size,
            max_tokens=max_tokens,
            temperature=temperature,
        )
    client = build_client(api_key, base_url)
    return run_async(
        client,
        items,
        openai_messages_fn or (lambda x: [{"role": "user", "content": x}]),
        model=model,
        concurrency=concurrency,
        max_tokens=max_tokens,
        temperature=temperature,
        desc=desc or "OpenAI",
    )
