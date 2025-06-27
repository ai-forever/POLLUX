import { Box } from '@mui/material';
import { FC } from 'react';
import styled from 'styled-components';
import { TogglesBlock } from './components/TogglesBlock';
import { DialoguesBlock } from './components/DialoguesBlock';
import { EvaluationDialogues } from './components/EvaluationDialogues';
import { EvaluationBlockProvider } from './storage';

const EvaluationkBlockWrapper = styled(Box)`
  width: 100%;
  display: flex;
  gap: 6px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

export const EvaluationBlock: FC = () => {
  return (
    <EvaluationkBlockWrapper>
      <EvaluationBlockProvider>
        <TogglesBlock />
        <DialoguesBlock />
        <EvaluationDialogues />
      </EvaluationBlockProvider>
    </EvaluationkBlockWrapper>
  );
};
