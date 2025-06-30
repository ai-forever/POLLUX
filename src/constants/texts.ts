export const firstBlockFirstParagraph =
  'We’ve organized these tasks — like stories, explanations, and summaries, where there is no single right answer — into a deep taxonomy of 35 fundamental types (with many branches) and created a smart algorithm for building tailored criteria sets for each instruction. This combines essential criteria (Critical, General, Subjective) with specialized Task/Domain criteria (66 total).';

export const firstBlockSecondParagraph =
  'The toolkit works in two modes: (i) A fixed benchmark of 2,100 instructions — all developed from scratch by domain experts without LLM involvement — paired with POLLUX LLM-as-a-Judge 7B/32B models trained on synthetic data and validated against 471,000+ expert-annotated criteria scores for instant reference. (ii) A flexible mode where researchers supply custom instructions, criteria or rubrics in an appropriate format; POLLUX then applies the same scoring pipeline.';

export const firstCarouselDescription =
  'POLLUX unites both the taxonomies of generative tasks and evaluation criteria and suggests an algorithm to constuct a set of evaluation aspects necessary to estimate the quality of a generated text based on its functional style and task category.';

export const firstBlockThirdParagraph =
  'Regular text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis tellus sit amet arcu vehicula, eget semper enimefficitur. Suspendisse consectetur volutpat mattis. Cras mattis imperdiet luctus. Cras turpis quam, blandit ut ante nec, volutpat dictum nisl. Ut sit amet interdum eros. Nulla a lorem laoreet lacus commodo lacinia. Aenean est ligula, viverra a condimentum ut, pretium at urna.';

export const secondBlockFirstParagraph =
  'Regular text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis tellus sit amet arcu vehicula, eget semper enim efficitur. Suspendisse consectetur volutpat mattis. Cras mattis imperdiet luctus. Cras turpis quam, blandit ut ante nec, volutpat dictum nisl. Ut sit amet interdum eros. Nulla a lorem laoreet lacus commodo lacinia. Aenean est ligula, viverra a condimentum ut, pretium at urna.';
export const secondCarouselDescription =
  "The POLLUX benchmarks includes 2,100 manuall crafted instructions that cover 152 generative tasks and 5 functional styles, 11,500 top-tier LLMs' answers, 471,515 point and 161,076 aggregate criteria estimates.";

export const thirdBlockFirstParagraph =
  'The POLLUX dataset represents a rich linguistic landscape across 93 distinct genres (35 literary, 26 journalistic, 7 official, and 25 scientific ones, plus general tasks). This comprehensive foundation enables our hierarchical task framework with 35 major task groups branching into 104 subgroups and 52 subsubgroups, creating 152 finely differentiated tasks.';

export const thirdBlockSecondParagraph =
  'Each task features three precisely calibrated complexity levels (Easy, Medium, Hard), with definitions specifically tailored to each task type. This granular approach required developing 451 unique complexity definitions to ensure accurate difficulty scaling.';

export const thirdBlockThirdParagraph =
  'A cornerstone of POLLUX is its focus on Russian language excellence. The literary domain covers 15 literary movements and 17 renowned Russian writers’ peculiarities. Domain experts also integrated 60 distinct stylistic devices into carefully crafted texts. Each device appears in multiple implementations across the benchmark. The most frequent ones include epithets, metaphors, and personification.';

export const thirdBlockFourthParagraph =
  'All criteria annotations underwent rigorous expert validation, with minimum dual-domain-expert review per criteria and strong inter-annotator agreement (κ = 0.71–0.97).';

export const fourthBlockFirstParagraph =
  'Our benchmarking system is built on a sophisticated multi-tier expert architecture. At the core are specialized Expert Panels comprising Domain Supervisors who oversaw the entire workflow, and Benchmark Developers, both involved in creating our modular task and criteria systems. These professionals – including active writers, university lecturers, scientists, and legal practitioners – brought deep domain expertise and hands-on LLM experience.';

export const fourthBlockSecondParagraph =
  'In total, 10 Expert Panels were formed: 5 for each functional style, 1 for editors, 1 for translators, and separate panels for code-related tasks, STEM, and information seeking. Every expert underwent a comprehensive three-stage qualification process: stringent selection based on educational background, professional experience, and LLM proficiency; as well as training and examination with a 0.7 matching coefficient threshold.';

export const usageNoteFirstParagraph =
  'The POLLUX benchmark is recommended for use exclusively as a testing dataset, as it features unique, manually crafted instructions paired with expert feedback. There are two primary ways to utilize this benchmark:';

export const usageNoteSecondParagraph =
  "First, you can use the existing instructions from the POLLUX dataset directly. Simply input these instructions to your model, collect the generated responses, and automatically evaluate them using POLLUX's LM-as-a-Judge models against the corresponding assessment criteria.";

export const usageNoteThirdParagraph =
  'Alternatively, you can create your own custom instructions, criteria, and rubrics. Format them according to the POLLUX specifications, then use the POLLUX model to generate appropriate scores for your evaluation.';

export const usageNoteFourthParagraph =
  'For detailed examples and implementation guidance on using POLLUX LM-as-a-Judge models, please refer to the';


