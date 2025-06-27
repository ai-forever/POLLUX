import { Settings } from 'react-slick';

export const settings: Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 500,
      settings: {
        arrows: false,
      },
    },
  ],
};
