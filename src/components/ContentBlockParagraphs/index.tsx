import { FC } from "react";
import styled from "styled-components";

interface ParagraphProps {
  text: string;
}

const StyledParagraph = styled.p`
  font-size: clamp(0.9375rem, 0.7908rem + 0.5102vw, 1.25rem);
  font-weight: 400;
  text-align: left;

  @media (max-width: 500px) {
    width: 400px;
  }
`

export const Paragraph: FC<ParagraphProps> = ({text}: ParagraphProps) => {
  return (  
    <StyledParagraph>
      {text}
    </StyledParagraph>
  )
}