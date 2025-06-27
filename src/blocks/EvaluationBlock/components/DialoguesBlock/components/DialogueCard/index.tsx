import { FC, useContext } from 'react';
import styled from 'styled-components';
import { EvaluationContext } from '../../../../storage/context';
import { TGroup } from '../../../../../BenchmarkBlock/components/PieChartBlock/types/pieChartTypes';

const StyledCard = styled.article<{ isActive: boolean }>`
  width: 374px;
  height: 244px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  border: 2px solid ${({ isActive }) => (isActive ? 'green' : '#f53838')};
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: ${({ isActive }) => (isActive ? 'green' : 'darkgreen')};
  }

  @media (max-width: 500px) {
    width: 270px;
  }
`;

const CardHeader = styled.div`
  text-align: start;
  background-color: rgba(245, 56, 56, 0.2);
  padding: 10px 35px 10px 14px;
`;

const CardBody = styled.div`
  text-align: start;
  padding-top: 10px;
  padding-left: 15px;
  height: 170px;
`;

const FromMessage = styled.span`
  font-weight: 600;
`;

interface DialogueCardProps {
  id: number;
  promptText: string;
  modelAnswer?: string;
  criterias: Array<TGroup>;
}

export const DialogueCard: FC<DialogueCardProps> = ({
  id,
  promptText,
  modelAnswer,
  criterias,
}: DialogueCardProps) => {
  const { setCriterias, setActiveCardId, activeCardId } =
    useContext(EvaluationContext);

  const setCriteriasHandle = () => {
    setActiveCardId(id);
    setCriterias(criterias);
  };

  const isActive = activeCardId === id;

  return (
    <StyledCard onClick={setCriteriasHandle} isActive={isActive}>
      <CardHeader>
        <FromMessage>Prompt: </FromMessage>
        {promptText}
      </CardHeader>
      <CardBody>
        <FromMessage>Model answer: </FromMessage>
        {modelAnswer && modelAnswer}
      </CardBody>
    </StyledCard>
  );
};
