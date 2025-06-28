import { FC, useState } from 'react';
import { EvaluationContext } from './context';
import { pieChartData } from '../../BenchmarkBlock/components/PieChartBlock/data/pieChartData';
import { TEvaluatiuonResult, TGroup } from '../../types';

interface EvaluationBlockProviderProps {
  children: React.ReactNode;
}

export const EvaluationBlockProvider: FC<EvaluationBlockProviderProps> = ({
  children,
}) => {
  const evaluationData = pieChartData.evaluation_result;
  const [foundedData, setFoundedData] = useState<Array<TEvaluatiuonResult>>([]);
  const [criterias, setCriterias] = useState<Array<TGroup>>([]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const taskSet = new Set();
  const difficultySet = new Set();
  const criteriaGroupSet = new Set();

  evaluationData.forEach((element) => {
    taskSet.add(element.task);
    difficultySet.add(element.difficulty);
    criteriaGroupSet.add(element.criteria_group);
  });

  const getResultsBySearch = (value: string) => {
    const results = evaluationData.filter(
      (evaluation) =>
        evaluation.task === value ||
        evaluation.criteria_group === value ||
        evaluation.difficulty === value,
    );

    return results;
  };

  const search = (value: string) => {
    const resultedArr = getResultsBySearch(value);
    setFoundedData(resultedArr);
  };

  return (
    <EvaluationContext.Provider
      value={{
        data: foundedData,
        search,
        criterias,
        setCriterias,
        activeCardId,
        setActiveCardId,
        taskSet,
        criteriaGroupSet,
        difficultySet,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
