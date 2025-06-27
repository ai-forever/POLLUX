import { FC } from 'react';
import { StyledLink, StyledNavBar } from './styledComponents';

export const NavBar: FC = () => {
  return (
    <StyledNavBar>
      <li>
        <StyledLink href="#news">News</StyledLink>
      </li>
      {/* Убрали по требованию заказчика, может вернем */}

      {/* <li>
        <StyledLink href="#comprasions">Comparsions</StyledLink>
      </li> */}
      <li>
        <StyledLink href="#benchmark">Navigate Benchmark</StyledLink>
      </li>
      <li>
        <StyledLink href="#evaluation">Evaluation Result</StyledLink>
      </li>
      <li>
        <StyledLink href="#statistics">Statistics</StyledLink>
      </li>
      <li>
        <StyledLink href="#experts">Experts</StyledLink>
      </li>
      <li>
        <StyledLink href="#notes">Notes</StyledLink>
      </li>
      <li>
        <StyledLink href="#citation">Citation</StyledLink>
      </li>
    </StyledNavBar>
  );
};
