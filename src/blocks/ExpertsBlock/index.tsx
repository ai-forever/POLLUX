import { FC } from 'react';
import styled from 'styled-components';
import { ExpertCards } from './components/ExpertCards';

const ExeprtsBlockWrapper = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

export const ExpertsBlock: FC = () => {
  return (
    <ExeprtsBlockWrapper>
      <ExpertCards />
    </ExeprtsBlockWrapper>
  );
};
