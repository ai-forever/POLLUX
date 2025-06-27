import { FC } from 'react';
import styled from 'styled-components';
import { expertsData } from './data';

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 194px;
  font-size: 20px;
  text-align: left;
`;

const StyledImg = styled.img`
  height: 252px;
`;

const ExpertDomain = styled.span`
  padding-left: 5px;
  color: #f53838;
`;

const Description = styled.span`
  padding-left: 5px;
  color: #6e6e6e;
`;

export const ExpertCards: FC = () => {
  const items = expertsData.map((expertCard, idx) => (
    <StyledCard key={idx}>
      <StyledImg src={expertCard.imgSrc} />
      <ExpertDomain>{expertCard.expertDomain}</ExpertDomain>
      <Description>{expertCard.description}</Description>
    </StyledCard>
  ));

  return items;
};
