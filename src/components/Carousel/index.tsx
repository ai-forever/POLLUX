import { settings } from './settings';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CarouselDescription,
  CaruoselWrapper,
  StyledImg,
} from './styledComponents';
import { FC } from 'react';
import Slider from 'react-slick';
import testPhoto from '../../assets/demoTest.jpg';

interface CarouselProps {
  descriptionText?: string;
  customStyle?: object;
}

export const Carousel: FC<CarouselProps> = ({
  descriptionText,
  customStyle,
}: CarouselProps) => {
  return (
    <CaruoselWrapper style={customStyle}>
      <Slider {...settings}>
        <div>
          <StyledImg src={testPhoto} />
        </div>
        <div>
          <StyledImg src={testPhoto} />
        </div>
        <div>
          <StyledImg src={testPhoto} />
        </div>
        <div>
          <StyledImg src={testPhoto} />
        </div>
        <div>
          <StyledImg src={testPhoto} />
        </div>
        <div>
          <StyledImg src={testPhoto} />
        </div>
      </Slider>
      {descriptionText && (
        <CarouselDescription>{descriptionText}</CarouselDescription>
      )}
    </CaruoselWrapper>
  );
};
