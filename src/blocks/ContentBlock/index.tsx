import { FC } from 'react';
import styled from 'styled-components';

interface ContentBlockProps {
  id?: string;
  headerText?: string;
  children: React.ReactNode;
}

const ContentBlockStyled = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 65px;

  @media (max-width: 500px) {
    gap: 30px;
  }
`;

const HeaderText = styled.h2`
  max-width: 1075px;
  min-width: 375px;
  font-family: 'Inter', sans-serif;
  font-weight: 800 !important;
  font-size: 35px !important;
  text-align: center;
  white-space: pre-wrap;

  @media (max-width: 500px) {
    width: 420px;
  }
`;

export const ContentBlock: FC<ContentBlockProps> = ({
  headerText,
  children,
  id,
}: ContentBlockProps) => {
  return (
    <ContentBlockStyled id={id}>
      {headerText && <HeaderText>{headerText}</HeaderText>}
      {children}
    </ContentBlockStyled>
  );
};
