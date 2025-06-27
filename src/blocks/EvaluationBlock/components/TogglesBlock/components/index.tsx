import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FC } from 'react';
import styled from 'styled-components';

interface CustomAccordionProps {
  name: string;
  children: React.ReactNode;
}

const StyledAccordion = styled(Accordion)`
  --Paper-shadow: none !important;
  & .css-1808mag-MuiPaper-root-MuiAccordion-root::before {
    content: none;
  }

  & .css-1808mag-MuiPaper-root-MuiAccordion-root.Mui-expanded {
    margin: none;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: none !important;
  border-radius: 8px !important;
  color: #9098a3 !important;
  text-transform: uppercase !important;

  & .css-rizt0-MuiTypography-root {
    font-size: 12px !important;
    font-weight: 800 !important;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 6px;
  border: 1px solid #eff0f6;
  border-radius: 6px;
`;

export const CustomAccordion: FC<CustomAccordionProps> = ({
  name,
  children,
}) => {
  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMore />} id={name}>
        <Typography>{name}</Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
};
