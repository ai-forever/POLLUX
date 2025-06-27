import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import styled from 'styled-components';
import { newsData } from '../../data/dataNews';

const NewsDataBlock = styled(Box)`
  display: flex;
  gap: 22px;
  align-items: center;
`;

const Icon = styled.img`
  height: 35px;
  width: 35px;
`;

const NewsDate = styled(Typography)`
  font-size: 20px !important;
  font-weight: 600 !important;
`;

const NewsHeadLine = styled(Typography)`
  font-size: 20px;
`;

export const NewsElements: FC = () => {
  const newsItems = newsData.map((newsElement, idx) => (
    <NewsDataBlock key={idx}>
      {newsElement.icon && <Icon src={newsElement.icon} />}
      <NewsDate>{newsElement.date}</NewsDate>
      <NewsHeadLine>{newsElement.newsHeadline}</NewsHeadLine>
    </NewsDataBlock>
  ));

  return newsItems;
};
