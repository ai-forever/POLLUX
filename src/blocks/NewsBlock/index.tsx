import { Box, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { NewsElements } from './components/NewsElement';

const NewsBlockStyled = styled(Box)`
  max-width: 1140px;
  width: 1140px;
  min-width: 375px;
  padding-top: 20px;
  padding-left: 40px;
  padding-bottom: 40px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 27px 12px rgba(13, 16, 37, 0.2);
  -moz-box-shadow: 0px 0px 27px 12px rgba(13, 16, 37, 0.2);
  box-shadow: 0px 0px 27px 12px rgba(13, 16, 37, 0.2);

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const NewsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const HeaderNews = styled(Typography)`
  font-size: 35px !important;
  font-weight: 600 !important;
  margin-bottom: 5px;
`

export const NewsBlock: FC = () => {
  return (
    <NewsBlockStyled>
      <HeaderNews>News</HeaderNews>
      <NewsWrapper>
        <NewsElements />
      </NewsWrapper>
    </NewsBlockStyled>
  );
};
