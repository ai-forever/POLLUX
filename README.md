<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./images/logo_pollux_square_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./images/logo_pollux_square_dark.svg">
    <img alt="POLLUX" src="./images/logo_pollux_square_light.svg" width="150">
  </picture>
</p>

<p align="center">
    <a href="https://huggingface.co/collections/ai-forever/pollux">
    <img alt="HuggingFace" src="https://img.shields.io/badge/HuggingFace-Collection-orange?logo=Hugging%20Face">
    </a>
    <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
    </a>
    <a href="https://github.com/ai-forever/pollux/releases">
    <img alt="Release" src="https://badgen.net/badge/release/v1.0.0/">
    </a>
    <a href="https://arxiv.org/abs/2505.00000">
    <img alt="Paper" src="https://img.shields.io/badge/arXiv-2505.00000-red">
    </a>
</p>


<h2 align="center">
    <p>A benchmark of LLM generative tasks in Russian.<br>And a family of LM-judges.</p>
</h2>

<div align="center">
  <h4>
    <a href="./pollux_inference.ipynb">Demo code</a> |
    <a href="https://huggingface.co/collections/ai-forever/pollux">Models & Dataset</a> |
    <a href="#-model-evaluation-results">Evaluation</a> |
    <a href="#citation">Publications</a>
  </h4>
</div>


Welcome to **POLLUX** 
– an open benchmark of 1,300 generative tasks in Russian. It includes a family of LLM-based judges specifically designed to automate the evaluation of model outputs across a wide range of tasks.

↗ 🧭 Navigate the benchmark sections and tasks on the [project page](ai-forever-pollux.githubpages.io).

↗ 🤗 See [Hugging Face collection](https://huggingface.co/collections/ai-forever/pollux) for the dataset and the models.


## <img src="./images/logo_pollux_min_light.svg" width="20" /> POLLUX features

- 📚 **1,300 diverse tasks**: Covering open-ended generation, text-to-text transformation, information-seeking, and code-related prompts. The task taxonomy is grounded in [analysis of real-world user queries](clustering_demo.ipynb).

- 🌡️ **47 evaluation criteria**: A rich set of non-overlapping fine-grained metrics — ranging from surface-level quality (e.g. absence of artifacts) to higher-level abilities like reasoning and creativity. Each criterion comes with a clearly defined evaluation scale.

- 📊 **Three difficulty levels**: Tasks are organized into easy, medium, and hard tiers to support targeted model diagnostics.

- 👩🏼‍🎓 **Expert-curated tasks**: All tasks and criteria are designed from scratch by domain experts to ensure quality and relevance.

- 🤖 **LLM-based evaluators**: A suite of judge models (7B and 32B) trained to assess responses against specific criteria and generate score justifications. **Supports custom criteria and evaluation scales via flexible input formatting (beta).**


## 🚀 Quickstart

Score model outputs with POLLUX judges: [pollux_inference.ipynb](pollux_inference.ipynb)


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


## ⚖️ Judges

POLLUX includes a family of LLM-based judges, trained to evaluate model outputs against scale-based criteria. The judges are designed to be flexible and can be adapted to different evaluation scales and criteria.

We provide two versions of the judges:
- **7B** ([T-lite](https://huggingface.co/t-tech/T-lite-it-1.0)-based): A smaller model that is faster and more efficient, suitable for quick evaluations and lower resource environments.
- **32B** ([T-pro](https://huggingface.co/t-tech/T-pro-it-1.0)-based): A larger model that provides more accurate evaluations, suitable for high-performance environments.

There are two architecture types in both sizes:
- **seq2seq**: A sequence-to-sequence model that generates a score and its justification in a decoder-only manner as a joint text output.
- **regression** (*-r* in HF model identifiers): A regression model that outputs a numeric score from an added regression head and generates the score justification in a decoder-only manner.


## 📊 LLM evaluation results

See project leaderboard for the evaluation of LLMs on POLLUX tasks: [Leaderboard](https://ai-forever.github.io/pollux/leaderboard.html).

To reproduce the evaluation results, please refer to the [evaluation.py](evaluation.py) file.


## 🔒 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Citation
If you use POLLUX in your research, please cite the following paper:

```bibtex
```

---

*Made with ❤️ by the POLLUX team*
