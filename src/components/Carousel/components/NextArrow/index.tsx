import { FC } from 'react';
import NextArrow from '../../assets/arrowSlide.svg'

interface CustomArrowsProps {
  onClick?: () => void;
  style?: object;
}

export const CustomNextArrow: FC<CustomArrowsProps>= ({onClick, style}: CustomArrowsProps) => {
  return (
    <button style={{...style}} onClick={onClick} disabled={true}>
      <img src={NextArrow}></img>
    </button>
  )
}