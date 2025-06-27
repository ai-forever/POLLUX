import { FC, useContext } from 'react';
import { CardCustom } from '../../../../components';
import { CardTask } from './components/Card';
import { Box } from '@mui/material';
import styled from 'styled-components';
import { DataContext } from '../PieChartBlock/storage/context';

const TaskBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;

  max-height: 690px;
  width: 255px;
  overflow: scroll;

  @media (max-width: 500px) {
    width: 410px;
    gap: 10px;
    padding-right: 8px;
    padding-left: 8px;
  }
`;

export const TaskBlock: FC = () => {
  const { optionText, questionText, subjectText, difficultyText } =
    useContext(DataContext);
  return (
    <TaskBlockWrapper>
      <CardCustom headerText="Tasks examples">
        <CardTask
          headerText="Science"
          isNeedDivider
          questionText={questionText}
          optionText={optionText}
          subjectText={subjectText}
          difficultyText={difficultyText}
        />
      </CardCustom>
    </TaskBlockWrapper>
  );
};
