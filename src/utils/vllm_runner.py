from typing import Any, Optional

from vllm import LLM, SamplingParams

DEFAULT_DTYPE = "bfloat16"
DEFAULT_MAX_TOKENS = 1024
DEFAULT_TEMPERATURE = 0.0


def _sampling(
    max_tokens: int = DEFAULT_MAX_TOKENS,
    temperature: float = DEFAULT_TEMPERATURE,
) -> SamplingParams:
    return SamplingParams(temperature=temperature, max_tokens=max_tokens)


def _common_kwargs(
    model: str,
    tokenizer: str,
    tensor_parallel_size: int,
) -> dict[str, Any]:
    return {
        "model": model,
        "tokenizer": tokenizer,
        "tensor_parallel_size": tensor_parallel_size,
        "trust_remote_code": True,
        "enforce_eager": False,
        "dtype": DEFAULT_DTYPE,
    }


def offline_generation(
    model_name: str,
    dialogues: list[list[dict]],
    tokenizer: Optional[str],
    tensor_parallel_size: int = 1,
    max_tokens: int = DEFAULT_MAX_TOKENS,
    temperature: float = DEFAULT_TEMPERATURE,
) -> list[str]:
    """Generate replies for each dialogue. Each dialogue is a list of messages (dict with 'role' and 'content')."""
    tokenizer_path = tokenizer or model_name
    llm = LLM(**_common_kwargs(model_name, tokenizer_path, tensor_parallel_size))
    sampling = _sampling(max_tokens=max_tokens, temperature=temperature)
    outputs = llm.chat(dialogues, sampling_params=sampling)
    return [out.outputs[0].text for out in outputs]
