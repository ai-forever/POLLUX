from vllm import LLM, SamplingParams
from utils.qwen2_vllm import Qwen2WithRegressionHead
from vllm import ModelRegistry
ModelRegistry.register_model("Qwen2WithRegressionHead", Qwen2WithRegressionHead)

def offline_generation(model_name, instructions, tokenizer, tensor_parallel_size=1, mode='chat'):
    llm = LLM(model=model_name, tokenizer=tokenizer, tensor_parallel_size=tensor_parallel_size, trust_remote_code=True, enforce_eager=False, dtype='bfloat16')
    if mode == 'chat':
        prompts = list(map(lambda x: [{"role": "user", "content": x}], instructions))
        outputs = llm.chat(prompts, sampling_params=SamplingParams(temperature=0, max_tokens =1024))
    elif mode == 'generate':
        outputs = llm.generate(instructions, sampling_params=SamplingParams(temperature=0, max_tokens =1024))
    answers = [output.outputs[0].text for output in outputs]
    return answers

def offline_regression(model_name, texts, tokenizer, tensor_parallel_size=1):
    llm = LLM(model=model_name, tokenizer=tokenizer, tensor_parallel_size=tensor_parallel_size, trust_remote_code=True, enforce_eager=False, dtype='bfloat16', task="classify",)
    outputs = llm.encode(texts)
    answers = [output.outputs.data.tolist()[0] for output in outputs]
    return answers