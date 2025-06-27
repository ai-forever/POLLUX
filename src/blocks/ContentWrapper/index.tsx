import { Box } from "@mui/material";
import { FC } from "react";
import styled from "styled-components";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  max-width: 1140px;
  min-width: 375px;

  @media (max-width: 500px) {
    width: 400px;
    gap: 40px;
  }
`

interface ContentBlockProps {
  children: React.ReactNode;
}

export const ContentWrapper: FC<ContentBlockProps> = ({children}: ContentBlockProps) => {
  return (
    <StyledBox>
      {children}
    </StyledBox>
  );
}