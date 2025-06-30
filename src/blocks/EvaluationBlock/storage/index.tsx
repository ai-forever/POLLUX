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
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [selectedCriteriaGroup, setSelectedCriteriaGroup] = useState<
    string | null
  >(null);
  const taskSet = new Set();
  const difficultySet = new Set();
  const criteriaGroupSet = new Set();
  evaluationData.forEach((element) => {
    taskSet.add(element.task);
    difficultySet.add(element.difficulty);
    criteriaGroupSet.add(element.criteria_group);
  });

  const getResultsBySearch = (
    task: string | null,
    difficulty: string | null,
    criteriaGroup: string | null,
  ) => {
    return evaluationData.filter((evaluation) => {
      const matchTask = task ? evaluation.task === task : true;
      const matchDifficulty = difficulty
        ? evaluation.difficulty === difficulty
        : true;
      const matchCriteriaGroup = criteriaGroup
        ? evaluation.criteria_group === criteriaGroup
        : true;

      return matchTask && matchDifficulty && matchCriteriaGroup;
    });
  };
  
  const search = (params: {
    task?: string | null;
    difficulty?: string | null;
    criteriaGroup?: string | null;
  }) => {
    const { task, difficulty, criteriaGroup } = params;

    if (task !== undefined) setSelectedTask(task);
    if (difficulty !== undefined) setSelectedDifficulty(difficulty);
    if (criteriaGroup !== undefined) setSelectedCriteriaGroup(criteriaGroup);

    const finalTask = task !== undefined ? task : selectedTask;
    const finalDifficulty =
      difficulty !== undefined ? difficulty : selectedDifficulty;
    const finalCriteriaGroup =
      criteriaGroup !== undefined ? criteriaGroup : selectedCriteriaGroup;

    const results = getResultsBySearch(
      finalTask,
      finalDifficulty,
      finalCriteriaGroup,
    );
    setFoundedData(results);
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
