import { FC } from "react";
import styled from "styled-components";

interface EvaluationCardProps {
  headerText: string;
  errorCategoryText: string;
  errorReasonText: string;
}

const StyledCard = styled.article`
  width: 332px;
  border: 2px solid #e5e5ef;
  border-radius: 20px;
  font-size: 16px;
  padding: 12px 18px;
  text-align: start;

  @media (max-width: 500px) {
    width: 100%;
  }
`

const CardHeader = styled.div`
  text-align: start;
  font-weight: 600;
  margin-bottom: 20px;
`

const FromMessage = styled.span`
  font-weight: 600;
`;

export const EvaluationCard: FC<EvaluationCardProps> = ({headerText, errorCategoryText, errorReasonText}) => {
  return (
    <StyledCard>
      <CardHeader>{headerText}</CardHeader>
      <FromMessage>Score: </FromMessage>
      {errorCategoryText}
      <hr />
      <FromMessage>Comment: </FromMessage>
      {errorReasonText}
    </StyledCard>
  )
}