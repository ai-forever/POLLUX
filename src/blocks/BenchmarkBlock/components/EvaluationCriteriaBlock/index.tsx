import { Box, Button, Tooltip } from '@mui/material';
import { FC, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { CardCustom, Carousel, CustomAccordion } from '../../../../components';
import { ContentBlock } from '../../../ContentBlock';
import { DataContext } from '../PieChartBlock/storage/context';
import { TCiteriaField } from '../../../types';

const EvaluationCriteriaBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 512px;
  width: 512px;

  @media (max-width: 500px) {
    width: 420px;
  }
`;

const StyledTypography = styled.span`
  font-size: clamp(0.75rem, 0.6327rem + 0.4082vw, 1rem);
  text-align: left;
  width: 440px;

  @media (max-width: 500px) {
    width: 400px;
  }
`;

const AccordionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 500px) {
    gap: 10px;
    width: 400px;
    padding-left: 10px;
  }
`;

export const EvaluationCriteriaBlock: FC = () => {
  const NO_DATA_TEXT = 'No data';
  const { criterias, text } = useContext(DataContext);
  if (criterias) {
    return (
      <EvaluationCriteriaBlockWrapper>
        <CardCustom headerText="Evaluation criteria">
          <AccordionsWrapper>
            <CustomAccordion name="fine grained">
              {criterias?.fine_grained ? (
                criterias?.fine_grained.map(
                  (element: TCiteriaField, idx: number) => (
                    <li key={idx}>
                      <Tooltip title={element.description}>
                        <Button>{element.name}</Button>
                      </Tooltip>
                    </li>
                  ),
                )
              ) : (
                <span>нет данных</span>
              )}
            </CustomAccordion>
            <CustomAccordion name="critical">
              {criterias?.critical ? (
                criterias?.critical.map(
                  (element: TCiteriaField, idx: number) => (
                    <li key={idx}>
                      <Tooltip title={element.description}>
                        <Button>{element.name}</Button>
                      </Tooltip>
                    </li>
                  ),
                )
              ) : (
                <span>{NO_DATA_TEXT}</span>
              )}
            </CustomAccordion>
            <CustomAccordion name="subjective">
              {criterias?.subjective ? (
                criterias?.subjective.map(
                  (element: TCiteriaField, idx: number) => (
                    <li key={idx}>
                      <Tooltip title={element.description}>
                        <Button>{element.name}</Button>
                      </Tooltip>
                    </li>
                  ),
                )
              ) : (
                <span>{NO_DATA_TEXT}</span>
              )}
            </CustomAccordion>
            <CustomAccordion name="domain specific">
              {criterias?.domain_specific ? (
                criterias?.domain_specific.map(
                  (element: TCiteriaField, idx: number) => (
                    <li key={idx}>
                      <Tooltip title={element.description}>
                        <Button>{element.name}</Button>
                      </Tooltip>
                    </li>
                  ),
                )
              ) : (
                <span>{NO_DATA_TEXT}</span>
              )}
            </CustomAccordion>
            <CustomAccordion name="task specific">
              {criterias?.task_specific ? (
                criterias?.task_specific.map(
                  (element: TCiteriaField, idx: number) => (
                    <li key={idx}>
                      <Tooltip title={element.description}>
                        <Button>{element.name}</Button>
                      </Tooltip>
                    </li>
                  ),
                )
              ) : (
                <span>{NO_DATA_TEXT}</span>
              )}
            </CustomAccordion>
          </AccordionsWrapper>
          <ContentBlock headerText="Text text">
            <StyledTypography>{text}</StyledTypography>
            <Carousel
              customStyle={{
                width: '345px',
                height: '162px',
                marginBottom: '40px',
              }}
            />
          </ContentBlock>
        </CardCustom>
      </EvaluationCriteriaBlockWrapper>
    );
  }

  return <></>;
};
