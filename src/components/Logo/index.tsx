import { Box } from '@mui/system';
import { FC } from 'react';
import styled from 'styled-components';
import LogoSvg from '../../assets/logo_pollux_horiz_short.svg';
import { ButtonStyled } from '../Button';

const StyledLogoWrapper = styled(Box)`
  margin-top: 184px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
`;

export const Logo: FC = () => {

  return (
    <StyledLogoWrapper>
      <img src={LogoSvg}></img>
      <ButtonStyled href='#benchmark' text="Navigate benchmark" />
    </StyledLogoWrapper>
  );
};
