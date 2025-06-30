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

import firstIntro from './images/intro/Main_POLLUX.png';
import secondIntro from './images/intro/Task taxonomy.png';
import thirdIntro from './images/intro/Tasks_to_criteria.png';

import firstBenchStats from './images/bench_stats/LexicalRichness.png';
import secondBenchStats from './images/bench_stats/Others.png';
import thirdBenchStats from './images/bench_stats/StylisticDevices.png';
import fourthBenchStats from './images/bench_stats/SubstylesandGenres.png';
import fifthBenchStats from './images/bench_stats/Task taxonomy.png';

import firstExperts from './images/experts/age.png';
import secondExperts from './images/experts/education.png';
import thirdExperts from './images/experts/experience.png';
import fourthExperts from './images/experts/field.png';
import fifthExperts from './images/experts/gender.png';
import sixthExperts from './images/experts/professions.png';
import seventhExperts from './images/experts/region.png';

interface CarouselProps {
  descriptionText?: string;
  customStyle?: object;
  nameCarousel: string;
}

export const Carousel: FC<CarouselProps> = ({
  descriptionText,
  customStyle,
  nameCarousel,
}: CarouselProps) => {
  if (nameCarousel === 'intro') {
    return (
      <CaruoselWrapper style={customStyle}>
        <Slider {...settings}>
          <div>
            <StyledImg src={firstIntro} />
          </div>
          <div>
            <StyledImg src={secondIntro} />
          </div>
          <div>
            <StyledImg src={thirdIntro} />
          </div>
        </Slider>
        {descriptionText && (
          <CarouselDescription>{descriptionText}</CarouselDescription>
        )}
      </CaruoselWrapper>
    );
  }

  if (nameCarousel === 'benchStats') {
    return (
      <CaruoselWrapper style={customStyle}>
        <Slider {...settings}>
          <div>
            <StyledImg src={firstBenchStats} />
          </div>
          <div>
            <StyledImg src={secondBenchStats} />
          </div>
          <div>
            <StyledImg src={thirdBenchStats} />
          </div>
          <div>
            <StyledImg src={fourthBenchStats} />
          </div>
          <div>
            <StyledImg src={fifthBenchStats} />
          </div>
        </Slider>
        {descriptionText && (
          <CarouselDescription>{descriptionText}</CarouselDescription>
        )}
      </CaruoselWrapper>
    );
  }

  if (nameCarousel === 'experts') {
    return (
      <CaruoselWrapper style={customStyle}>
        <Slider {...settings}>
          <div>
            <StyledImg src={firstExperts} />
          </div>
          <div>
            <StyledImg src={secondExperts} />
          </div>
          <div>
            <StyledImg src={thirdExperts} />
          </div>
          <div>
            <StyledImg src={fourthExperts} />
          </div>
          <div>
            <StyledImg src={fifthExperts} />
          </div>
          <div>
            <StyledImg src={sixthExperts} />
          </div>
          <div>
            <StyledImg src={seventhExperts} />
          </div>
        </Slider>
        {descriptionText && (
          <CarouselDescription>{descriptionText}</CarouselDescription>
        )}
      </CaruoselWrapper>
    );
  }
};
