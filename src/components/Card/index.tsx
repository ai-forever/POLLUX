import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from 'styled-components';
interface CardProps {
  children: React.ReactNode;
  headerText?: string;
  hintHeaderText?: string;
  isNeedDivider?: boolean;
}

const CardWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid #e5e5ef;
  padding-left: 24px;
  padding-right: 24px;
  overflow-y: scroll

  @media (max-width: 500px) {
    padding-left: 5px;
    padding-right: 5px;
    width: 400px;
  }
`;

const StyledCardHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 9px;
  width: 95%;
  margin-top: 22px;
  font-size: 20px;
  font-weight: 800;
`;

const HintHeader = styled(Typography)`
  font-size: 12px;
  width: 100;
  color: #9291a5;
`;

const CardContentWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
  flex-direction: column;
`;

const StyledHr = styled.hr`
  width: 100%;
  height: 1px;
  color: #e5e5ef;
  opacity: 0.4;
`;

export const CardCustom: FC<CardProps> = ({
  children,
  headerText,
  hintHeaderText,
  isNeedDivider,
}: CardProps) => {
  return (
    <CardWrapper>
      <StyledCardHeader>
        {headerText}
        {hintHeaderText && <HintHeader>{hintHeaderText}</HintHeader>}
        {isNeedDivider && <StyledHr />}
      </StyledCardHeader>
      <CardContentWrapper>{children}</CardContentWrapper>
    </CardWrapper>
  );
};
