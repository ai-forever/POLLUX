import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import { CustomAccordion } from './components';
import { EvaluationContext } from '../../storage/context';
import { CardCustom } from '../../../../components';

const TogglesBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 340px;
  width: 340px;
`;

export const TogglesBlock: FC = () => {
  const { search, taskSet, difficultySet, criteriaGroupSet } =
    useContext(EvaluationContext);
  const onChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    search(event.currentTarget.value);
  };

  const [taskArr, setTaskArr] = useState<Array<string>>(
    Array.from(taskSet) as Array<string>,
  );

  const [difficultyArr, setDifficultyArr] = useState<Array<string>>(
    Array.from(difficultySet) as Array<string>,
  );

  const [criteriaGroupArr, setCriteriaGroupArr] = useState<Array<string>>(
    Array.from(criteriaGroupSet) as Array<string>,
  );

  const taskItems = taskArr.map((task) => (
    <FormControlLabel
      value={task}
      control={<Radio />}
      label={task}
      onChange={onChangeHandle}
    />
  ));

  const difficultyItems = difficultyArr.map((difficulty) => (
    <FormControlLabel
      value={difficulty}
      control={<Radio />}
      label={difficulty}
      onChange={onChangeHandle}
    />
  ));

  const criteriaGroupItems = criteriaGroupArr.map((criteriaGroup) => (
    <FormControlLabel
      value={criteriaGroup}
      control={<Radio />}
      label={criteriaGroup}
      onChange={onChangeHandle}
    />
  ));

  return (
    <TogglesBlockWrapper>
      <CardCustom headerText="Тоглы - фильтры">
        <CustomAccordion name="Таска">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="level-radiobuttons"
            >
              {taskItems}
            </RadioGroup>
          </FormControl>
        </CustomAccordion>
        <CustomAccordion name="Сложность">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="level-radiobuttons"
            >
              {difficultyItems}
            </RadioGroup>
          </FormControl>
        </CustomAccordion>
        <CustomAccordion name="Группа критериев">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="level-radiobuttons"
            >
              {criteriaGroupItems}
            </RadioGroup>
          </FormControl>
        </CustomAccordion>
      </CardCustom>
    </TogglesBlockWrapper>
  );
};
