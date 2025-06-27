import { FC } from 'react';
import styled from 'styled-components';
import { PiechartBlock, TaskBlock } from './components';
import { EvaluationCriteriaBlock } from './components/EvaluationCriteriaBlock';
import { PieChartProvider } from './components/PieChartBlock/storage';

const BenchmarkBlockWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 6px;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

export const BenchmarkBlock: FC = () => {
  return (
    <BenchmarkBlockWrapper>
      <PieChartProvider>
        <PiechartBlock />
        <EvaluationCriteriaBlock />
        <TaskBlock />
      </PieChartProvider>
    </BenchmarkBlockWrapper>
  );
};
