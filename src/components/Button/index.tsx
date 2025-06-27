import { FC } from 'react';
import styled from 'styled-components';

export const ButtonStyle = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 60px;
    font-family: 'Rubik', sans-serif;
    font-weight: 600;
    border-radius: 10px;
    color: #fff;
    background-color: #f53838;
    -webkit-box-shadow: 0px 69px 46px -21px rgba(245, 56, 56, 0.35);
    -moz-box-shadow: 0px 69px 46px -21px rgba(245, 56, 56, 0.35);
    box-shadow: 0px 40px 35px -21px rgba(245, 56, 56, 0.35);
    text-transform: none;
    transition: transform 0.5s ease;
    text-decoration: none;

    &:hover {
      transform: scale(1.1);
    }
`;

interface ButtonStyledProps {
    text: string;
    href: string;
}

export const ButtonStyled: FC<ButtonStyledProps> = ({
    href,
    text
}: ButtonStyledProps) => {
    return <ButtonStyle href={href}>{text}</ButtonStyle>;
};
