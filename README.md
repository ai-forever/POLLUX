<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./images/logo_pollux_square_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./images/logo_pollux_square_dark.svg">
    <img alt="POLLUX" src="./images/logo_pollux_square_light.svg" width="150">
  </picture>
</p>

<p align="center">
    <a href="https://huggingface.co/collections/ai-forever/pollux-68418d171bb9a4ac1e62b424">
    <img alt="HuggingFace" src="https://img.shields.io/badge/HuggingFace-Collection-orange?logo=Hugging%20Face">
    </a>
    <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
    </a>
    <a href="https://github.com/ai-forever/pollux/releases">
    <img alt="Release" src="https://badgen.net/badge/release/v1.0.0/">
    </a>
    <a href="https://arxiv.org/pdf/2505.24616">
    <img alt="Paper" src="https://img.shields.io/badge/arXiv-2505.00000-red">
    </a>
</p>


<h2 align="center">
    <p>Evaluating the Generative Capabilities of LLMs in Russian.<br>Benchmark and a family of LM-as-a-Judge models.</p>
</h2>

<div align="center">
  <h4>
    <a href="./demo.ipynb">Demo code</a> |
    <a href="https://huggingface.co/collections/ai-forever/pollux-68418d171bb9a4ac1e62b424">Models & Dataset</a> |
    <a href="ai-forever-pollux.githubpages.io">Benchmark demo</a> |
    <a href="#citation">Publications</a>
  </h4>
</div>


Welcome to **POLLUX** 
– an open-source project dedicated to evaluating the generative capabilities of modern large language models (LLMs) in Russian.

Our comprehensive evaluation framework is built on three foundational pillars. First, we provide carefully developed 📊 **taxonomies** that systematically categorize both generative tasks and evaluation criteria. Second, our meticulously crafted 🌟 **benchmark** comprises 2,100 unique, manually created instructions paired with 471,515 detailed point criteria assessments. Finally, POLLUX features a specialized ⚖️ **family of LLM-based judges** that automate the evaluation process, enabling scalable and systematic assessment of model outputs across all task categories.

↗ 🧭 Explore the benchmark on the [project page](ai-forever-pollux.githubpages.io).

↗ 🤗 See [Hugging Face collection](https://huggingface.co/collections/ai-forever/pollux-68418d171bb9a4ac1e62b424) for the dataset and the models.


## <img src="./images/logo_pollux_min_light.svg" width="20" /> POLLUX features

- 📚 **152 diverse tasks**: Covering open-ended generation, text-to-text transformation, information-seeking, and code-related prompts. The task taxonomy is grounded in [analysis of real-world user queries](clustering_demo.ipynb).

- 🌡️ **66 unique evaluation criteria**: A rich set of non-overlapping fine-grained metrics — ranging from surface-level quality (e.g. absence of artifacts) to higher-level abilities like reasoning and creativity. Each criterion comes with a clearly defined evaluation scale.

- 📊 **Three difficulty levels**: Tasks are organized into easy, medium, and hard tiers to support targeted model diagnostics.

- 👩🏼‍🎓 **Expert-curated tasks**: All tasks and criteria are designed from scratch by domain experts to ensure quality and relevance. All instructions and criteria annotations are similarly developed and reviewed by experts panels to maintain consistent standards throughout the evaluation process.

- 🤖 **LLM-based evaluators**: A suite of judge models (7B and 32B) trained to assess responses against specific criteria and generate score justifications. **Supports custom criteria and evaluation scales via flexible input formatting (beta).**


## 🚀 Quickstart

Score model outputs with POLLUX judges: [demo.ipynb](demo.ipynb)

To reproduce the evaluation results, please refer to the [src/inference.py](evaluation.py) file.

```python .\src\inference.py --test_path ai-forever/POLLUX --template_path src/data_utils\test_prompt_template_ru.yaml --num_proc 1 inference_offline_vllm --model_path ai-forever/pollux-judge-7b --tokenizer_path ai-forever/pollux-judge-7b --tensor_parallel_size 1 --answer_path pollux_judge_7b.json```

```python .\src\inference.py --test_path ai-forever/POLLUX --template_path src/data_utils\test_prompt_template_ru.yaml --num_proc 1 compute_metrics --answer_path logs/pollux_judge_7b.json```



## 📂 Repository Structure

```
pollux/
├── images/                 # project logo
├── bench_meta/             # benchmark metadata
├── clustering_demo.ipynb   # user logs analysis
├── src/                    # inference tools
├── src/inference.py        # reproduce evaluation
├── LICENSE                 # license
└── demo.ipynb              # inference demo
```

## 🌟 Benchmark

The POLLUX benchmark is built upon comprehensive taxonomies of generative tasks and evaluation criteria. Our taxonomy of generative tasks encompasses 35 general task groups organized across two hierarchical levels (functional styles/substyles and genres), covering a total of 152 distinct tasks. 📊

Our taxonomy of evaluation criteria features five comprehensive categories that assess:
- 🔍 General & Critical: Core syntactic, lexical, and semantic text properties
- 🎯 Domain-specific: Properties tied to specialized functional styles  
- ✅ Task-specific: Task-oriented markers and requirements
- 💭 Subjective: Human preferences and subjective opinions

▎📈 Benchmark Scale & Coverage

The benchmark contains 2,100 unique instructions evenly distributed across all 35 task groups, with three complexity levels per group. Each instruction includes responses from 7 top-tier LLMs:
- 🤖 OpenAI o1 & GPT-4o
- 🧠 Claude 3.5 Sonnet  
- 🦙 Llama 405B
- ⚡️ T-pro-it-1.0
- 🔍 YandexGPT 4 Pro
- 💎 GigaChat Max

This results in 11,500 total responses across the benchmark! 🚀

▎🔬 Expert Evaluation Process

Every response is scrupulously evaluated using a tailored criteria set combining:
- Critical, Subjective, and General criteria
- Relevant Domain- and Task-specific criteria

With at least two expert evaluators per criterion, we've collected:
- 471,000+ individual criteria estimates with textual rationales ✍️
- 161,076 aggregate (over overlap) numerical scores 📊

▎🌐 Access & Exploration

Ready to dive in? Access the benchmark on its [home page](https://huggingface.co/datasets/ai-forever/POLLUX) and explore the data through our interactive demo! 🎮 



## ⚖️ Judges

POLLUX includes a family of LLM-based judges, trained to evaluate model outputs against scale-based criteria. The judges are designed to be flexible and can be adapted to different evaluation scales and criteria.

We provide two versions of the judges:
- **7B** ([T-lite](https://huggingface.co/t-tech/T-lite-it-1.0)-based): A smaller model that is faster and more efficient, suitable for quick evaluations and lower resource environments.
- **32B** ([T-pro](https://huggingface.co/t-tech/T-pro-it-1.0)-based): A larger model that provides more accurate evaluations, suitable for high-performance environments.

There are two architecture types in both sizes:
- **seq2seq**: A sequence-to-sequence model that generates a score and its justification in a decoder-only manner as a joint text output.
- **regression** (*-r* in HF model identifiers): A regression model that outputs a numeric score from an added regression head and generates the score justification in a decoder-only manner.



## 🔒 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Citation
If you use POLLUX in your research, please cite the following paper:

```bibtex
@misc{martynov2025eyejudgementdissectingevaluation,
      title={Eye of Judgement: Dissecting the Evaluation of Russian-speaking LLMs with POLLUX}, 
      author={Nikita Martynov and Anastasia Mordasheva and Dmitriy Gorbetskiy and Danil Astafurov and Ulyana Isaeva and Elina Basyrova and Sergey Skachkov and Victoria Berestova and Nikolay Ivanov and Valeriia Zanina and Alena Fenogenova},
      year={2025},
      eprint={2505.24616},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2505.24616}, 
}
```

---

*Made with ❤️ by the POLLUX team*
