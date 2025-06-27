import { TCriteria, TTaskSpecificValue } from '../../../../types';
import { pieChartData } from './pieChartData';

export type RechartsDataItem = {
  name: string;
  value: number;
  children?: RechartsDataItem[];
  question: string;
  option: string;
  subject: string;
  difficulty: string;
  criteria: TCriteria;
  text: string;
};


function convertTaskSpecificToRechartsData(
  taskSpecific: Record<string, TTaskSpecificValue>,
): RechartsDataItem[] {
  const processNode = (
    key: string,
    value: TTaskSpecificValue,
  ): RechartsDataItem => {
    if ('count' in value) {
      const children: RechartsDataItem[] = [];

      for (const subKey in value) {
        const subValue = (value as any)[subKey];
        if (typeof subValue === 'object' && 'count' in subValue) {
          children.push(processNode(subKey, subValue));
        }
      }

      return {
        name: key,
        value: value.count,
        children: children.length ? children : undefined,
        question: value.examples[0].question,
        option: value.examples[0].option,
        subject: value.examples[0].subject,
        difficulty: value.examples[0].difficulty,
        text: value.text,
        criteria: {
          fine_grained: value.criteria?.fine_grained,
          subjective: value.criteria?.subjective,
          domain_specific: value.criteria?.domain_specific,
          task_specific: value.criteria?.task_specific,
          critical: value.criteria?.critical,
        },
      };
    }

    const children: RechartsDataItem[] = [];

    for (const subKey in value) {
      children.push(processNode(subKey, value[subKey]));
    }

    return {
      name: key,
      value: 0,
      children: children,
    };
  };

  return Object.entries(taskSpecific).map(([key, value]) =>
    processNode(key, value),
  );
}
export const transformedData = convertTaskSpecificToRechartsData(
  pieChartData.task_specific,
);
