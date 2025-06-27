import { FC } from 'react';
import styled from 'styled-components';

interface CustomImageProps {
  src: string;
}

const StyledImg = styled.img`
  @media (max-width: 500px) {
    width: 400px;
  }
`;

export const CustomImage: FC<CustomImageProps> = ({
  src,
}: CustomImageProps) => {
  return <StyledImg src={src} />;
};
