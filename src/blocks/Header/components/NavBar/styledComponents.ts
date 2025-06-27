import styled from 'styled-components';

export const StyledNavBar = styled.ul`
  display: flex;
  gap: 32px;
  list-style-type: none;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 10px;
    padding-left: 0;
  }
`;

export const StyledLink = styled.a`
  position: relative;
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  text-decoration: none;
  color: #4f5665;
  white-space: nowrap;
  cursor: pointer;

  &:after {
    display: block;
    position: absolute;
    bottom: 0;
    content: '';
    transition: width 0.6s ease;
    width: 0;
    height: 2px;
    background: #4f5665;
  }

  &:hover:after {
    width: 100%;
  }
`;
