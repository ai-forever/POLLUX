import torch
import torch.nn as nn
from vllm.model_executor.models.interfaces import SupportsLoRA, SupportsPP
from vllm.model_executor.models.utils import WeightsMapper, maybe_prefix
from vllm.model_executor.models.qwen2 import Qwen2Model
from vllm.model_executor.layers.pooler import Pooler, PoolingType
from vllm.config import VllmConfig
from vllm.sequence import PoolerOutput, PoolingSequenceGroupOutput
from vllm.logger import init_logger
import itertools
from vllm.model_executor.model_loader.weight_utils import default_weight_loader

logger = init_logger(__name__)

class Qwen2WithRegressionHead(nn.Module, SupportsLoRA, SupportsPP):
    packed_modules_mapping = {
        "qkv_proj": [
            "q_proj",
            "k_proj",
            "v_proj",
        ],
        "gate_up_proj": [
            "gate_proj",
            "up_proj",
        ],
    }

    hf_to_vllm_mapper = WeightsMapper(orig_to_new_prefix={"model.": ""})

    def __init__(self, *, vllm_config: VllmConfig, prefix: str = ""):
        super().__init__()
        config = vllm_config.model_config.hf_config
        quant_config = vllm_config.quant_config
        lora_config = vllm_config.lora_config
        pooler_config = vllm_config.model_config.pooler_config

        self.config = config
        self.lora_config = lora_config

        self.quant_config = quant_config
        self.model = Qwen2Model(vllm_config=vllm_config,
                                prefix=maybe_prefix(prefix, "model"))
        self.regression_head = nn.Linear(config.hidden_size, 1)


        self._pooler = Pooler.from_config_with_defaults(
            pooler_config,
            pooling_type=PoolingType.LAST,
            normalize=False,
            softmax=False)

    def forward(
        self,
        input_ids: torch.Tensor,
        positions: torch.Tensor,
        intermediate_tensors = None,
    ) -> torch.Tensor:
        return self.model(input_ids, positions, intermediate_tensors)

    def pooler(
        self,
        hidden_states: torch.Tensor,
        pooling_metadata,
    ):
        pooled_data = self._pooler(hidden_states, pooling_metadata).outputs
        pooled_outputs = [PoolingSequenceGroupOutput(self.regression_head(data.data)) for data in pooled_data]
        return PoolerOutput(outputs=pooled_outputs)

    def load_weights(self, weights):
        weights = self.hf_to_vllm_mapper.apply(weights)
        weights1, weights2 = itertools.tee(weights)
        weights1 = ((name, data) for name, data in weights1
                   if name.startswith("regression_head."))
        weights2 = ((name, data) for name, data in weights2
                   if not name.startswith("lm_head.") and not name.startswith("regression_head."))
        self.model.load_weights(weights2)
        params_dict = dict(self.named_parameters())
        logger.error(weights1)
        for name, loaded_weight in weights1:
            logger.error(name)
            if name.startswith("regression"):
                param = params_dict[name]
                weight_loader = getattr(param, "weight_loader",
                                        default_weight_loader)
                weight_loader(param, loaded_weight)