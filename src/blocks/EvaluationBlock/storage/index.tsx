import { FC, useState } from 'react';
import { EvaluationContext } from './context';
import { pieChartData } from '../../BenchmarkBlock/components/PieChartBlock/data/pieChartData';
import {
  TEvaluatiuonResult,
  TGroup,
} from '../../BenchmarkBlock/components/PieChartBlock/types/pieChartTypes';

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
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
