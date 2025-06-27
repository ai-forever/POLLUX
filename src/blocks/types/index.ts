export type TCiteriaField = {
  name: string;
  description: string;
}

export type TCriteria = {
  fine_grained: Array<TCiteriaField>;
  critical: Array<TCiteriaField>;
  subjective: Array<TCiteriaField>;
  domain_specific: Array<TCiteriaField>;
  task_specific: Array<TCiteriaField>;
};

export type TExamples = {
  question: string;
  option: string;
  subject: string;
  difficulty: string;
};

export type TDomainSpecificValue = {
  count: number;
  criteria: TCriteria;
  examples: Array<TExamples>;
};

export type TSubTasks = {
  [key: string]: TTaskSpecificValue;
};

export type TTaskSpecificValue = TSubTasks | {
  count: number;
  criteria?: TCriteria;
  text: string;
  examples: Array<TExamples>;
};

export type TGroupElement = {
  category: string;
  reason: string;
};

export type TGroup = Record<string, Array<TGroupElement>>;

export type TEvaluatiuonResult = {
  task: string;
  difficulty: string;
  criteria_group: string;
  prompt: string;
  model_answer: string;
  evaluation_criteria: TGroup;
};

export type TPieChart = {
  domain_specific: Record<string, TDomainSpecificValue>;
  task_specific: Record<string, TTaskSpecificValue>;
  evaluation_result: Array<TEvaluatiuonResult>;
};
