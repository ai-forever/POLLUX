import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import styled from 'styled-components';

export const CaruoselWrapper = styled.div`
  max-width: 945px;
  width: 100%;
  height: 100%;
  min-width: 345px;
  max-height: 445px;
  min-height: 162px;

  & .slick-list {
    max-width: 945px;
    min-height: 162px;
    max-height: 445px;
    height: 100%;
  }

  & .slick-next:before {
    color: red;
  }

  & .slick-prev:before {
    color: red;
  }

  @media (max-width: 500px) {
    width: 400px;
  }
`;

export const StyledImg = styled.img`
  max-width: 100%;
`;

export const StyledCarousel = styled(Slider)`
  & .slick-list {
    position: relative;
    max-width: 945px;
    max-height: 445px;
    height: 445px;
    background-color: #d9d9d9;
  }

  & .slick-arrow.slick-prev {
    position: absolute;
    left: -90px;
    width: 60px;
    height: 60px;
    border: 1px solid #f53838;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    background-color: #ffffff;
    z-index: 1;
  }

  & .slick-arrow.slick-next {
    position: absolute;
    right: -90px;
    width: 60px;
    height: 60px;
    border: 1px solid #f53838;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    background-color: #ffffff;
    z-index: 1;
    background: url('./assets/arrowSlide.svg');
  }

  & .slick-arrow.slick-next::before {
    content: url('./assets/arrowSlide.svg');
    color: black;
  }

  & .slick-arrow.slick-next:hover {
    background-color: #f53838;
    color: white;
  }

  & .slick-arrow.slick-prev:hover {
    background-color: #f53838;
  }

  & .slick-dots {
    top: -40px;
    left: -390px;
    color: #dde0e4;
  }

  & .slick-track {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slick-dots li button:before {
    transform: scale(2.5);
    transition: transform 0.5s ease;
  }

  .slick-dots li.slick-active button:before {
    color: #f53838;
    transform: scaleX(5) scaleY(2);
    transition: transform 0.5s ease;
  }
`;

export const CenteredCarouselContent = styled(Box)`
  text-align: center;
`;

export const CarouselDescription = styled.span`
  margin-top: 30px;
  max-width: 820px;
  font-size: 20px;
  font-weight: 800;
`;
