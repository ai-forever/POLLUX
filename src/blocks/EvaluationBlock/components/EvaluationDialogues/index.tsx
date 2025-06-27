import { Box } from '@mui/material';
import { FC, useContext } from 'react';
import styled from 'styled-components';
import { CardCustom } from '../../../../components';
import { EvaluationCard } from './components/EvaluationCard';
import { EvaluationContext } from '../../storage/context';
import { TGroupElement } from '../../../types';

const EvaluationBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 383px;
  max-height: 690px;
  height: 690px;
  overflow: scroll;

  @media (max-width: 500px) {
    width: 400px;
  }
`;

export const EvaluationDialogues: FC = () => {
  const { activeCardId, criterias} = useContext(EvaluationContext);

  if (activeCardId) {

    return (
      <CardCustom>
        <EvaluationBlockWrapper>
          {criterias &&
            Object.entries(criterias).map(([_, items]) =>
              items.map((item: TGroupElement, idx) => (
                <EvaluationCard
                  key={idx}
                  headerText="Evaluation by criteria"
                  errorCategoryText={item.category}
                  errorReasonText={item.reason}
                />
              )),
            )}
        </EvaluationBlockWrapper>
      </CardCustom>
    );
  }

  return (
    <></>
  )
};
