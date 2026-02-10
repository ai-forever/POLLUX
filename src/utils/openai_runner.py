import asyncio
from typing import Callable, Optional

from openai import AsyncOpenAI
from tqdm.asyncio import tqdm_asyncio


def build_client(
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
) -> AsyncOpenAI:
    if not api_key:
        raise ValueError("Set OPENAI_API_KEY in env or pass api_key")
    kwargs: dict = {"api_key": api_key}
    if base_url:
        kwargs["base_url"] = base_url
    return AsyncOpenAI(**kwargs)


def run_async(
    client: AsyncOpenAI,
    items: list,
    messages_fn: Callable[[object], list[dict]],
    model: str,
    concurrency: int = 10,
    max_tokens: int = 4096,
    temperature: float = 0.7,
    desc: str = "",
) -> list[str]:
    semaphore = asyncio.Semaphore(concurrency)

    async def request_one(item: object) -> str:
        async with semaphore:
            
            try:
                resp = await client.chat.completions.create(
                    model=model,
                    messages=messages_fn(item),
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                content = resp.choices[0].message.content
                return content if content is not None else ""
            except Exception as e:
                print(f"Error: {e!r}", flush=True)
                return ""
    tasks = [request_one(item) for item in items]
    return asyncio.run(tqdm_asyncio.gather(*tasks, desc=desc or "OpenAI"))
