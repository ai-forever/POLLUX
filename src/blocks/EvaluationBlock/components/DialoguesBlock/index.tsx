import { FC, useContext } from 'react';
import { DialogueCard } from './components/DialogueCard';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { CardCustom } from '../../../../components';
import { EvaluationContext } from '../../storage/context';
import { TEvaluatiuonResult } from '../../../types';

const DialoguesBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 450px;
  max-height: 690px;
  width: 450px;
  overflow: scroll;

  @media (max-width: 500px) {
    width: 300px;
  }
`;

export const DialoguesBlock: FC = () => {
  const { data } = useContext(EvaluationContext);

  return (
    <CardCustom>
      <DialoguesBlockWrapper>
        {data ? (
          data.map((item: TEvaluatiuonResult, idx) => (
            <DialogueCard
              // без +1 не открывался evaluation by criteria блок, при нажатии на первый элемент
              id={idx + 1}
              key={idx}
              promptText={item.prompt}
              modelAnswer={item.model_answer}
              criterias={item.evaluation_criteria}
            ></DialogueCard>
          ))
        ) : (
          <span>Нажмите на тоглы чтобы увидеть данные</span>
        )}
      </DialoguesBlockWrapper>
    </CardCustom>
  );
};
