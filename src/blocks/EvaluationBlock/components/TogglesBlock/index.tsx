import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FC, useContext } from 'react';
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
  const { search } = useContext(EvaluationContext);
  const onChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    search(event.currentTarget.value);
  };
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
              <FormControlLabel
                value="task1"
                control={<Radio />}
                label="1 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="task2"
                control={<Radio />}
                label="2 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="task3"
                control={<Radio />}
                label="3 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="task4"
                control={<Radio />}
                label="4 уровень"
                onChange={onChangeHandle}
              />
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
              <FormControlLabel
                value="option1"
                control={<Radio />}
                label="1 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="option2"
                control={<Radio />}
                label="2 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="option3"
                control={<Radio />}
                label="3 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="option4"
                control={<Radio />}
                label="4 уровень"
                onChange={onChangeHandle}
              />
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
              <FormControlLabel
                value="group1"
                control={<Radio />}
                label="1 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="group2"
                control={<Radio />}
                label="2 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="group3"
                control={<Radio />}
                label="3 уровень"
                onChange={onChangeHandle}
              />
              <FormControlLabel
                value="group4"
                control={<Radio />}
                label="4 уровень"
                onChange={onChangeHandle}
              />
            </RadioGroup>
          </FormControl>
        </CustomAccordion>
      </CardCustom>
    </TogglesBlockWrapper>
  );
};
