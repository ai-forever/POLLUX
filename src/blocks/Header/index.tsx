import { FC } from 'react';
import styled from 'styled-components';
import { NavBar } from './components';
import LogoSvg from '../../assets/logo_pollux_horiz_short.svg';

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  height: 50px;
  margin-top: 50px;
  align-items: center;
  gap: 15px;

  @media (max-width: 500px) {
    flex-direction: column;
    margin-top: 150px;
  }
`;

const StyledLogo = styled.img`
  width: 155px;
  height: 42px;
`;

export const Header: FC = () => {
  return (
    <StyledHeader>
      <StyledLogo src={LogoSvg}></StyledLogo>
      <NavBar />
    </StyledHeader>
  );
};
