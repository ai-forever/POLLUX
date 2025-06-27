import { Button, Modal } from '@mui/material';
import { FC, useState } from 'react';
import styled from 'styled-components';

interface CardProps {
  headerText?: string;
  hintHeaderText?: string;
  isNeedDivider?: boolean;
  questionText: string;
  optionText: string;
  subjectText: string;
  difficultyText: string;
}

const CardWrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 208px;
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid #f53838;
  padding-left: 14px;
  padding-right: 14px;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  width: 95%;
  margin-top: 22px;
  font-size: 20px;
  font-weight: 800;
`;

const HintHeader = styled.span`
  font-size: 12px;
  width: 100;
  color: #9291a5;
`;

const CardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  flex-wrap: wrap;
  gap: 30px;
  width: 180px;
  margin-bottom: 10px;
  text-align: start;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const DialogueBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: clamp(0.75rem, 0.6523rem + 0.3125vw, 0.875rem);
`;

const StyledHr = styled.hr`
  width: 100%;
  height: 1px;
  color: #e5e5ef;
  opacity: 0.4;
`;

const FromMessage = styled.div`
  font-weight: 600;
`;

const TextMessage = styled.span`
  font-weight: 400;
`;

const StyledButton = styled(Button)`
  position: absolute !important;
  bottom: -5px;
  right: -8px;
  min-width: 20px !important;

  height: 20px !important;
  background-color: #f53838 !important;
  border: 1px solid #f53838 !important;
  border-radius: 50% !important;
  transition: transform 0.5s ease !important;

  &:hover {
    transform: scale(1.2);
  }

  &::after {
    position: absolute;
    top: 3px;
    right: 3px;
    content: '';
    width: 8px;
    height: 8px;
    border-top: 2px solid #fff;
    border-right: 2px solid #fff;
    border-radius: 2px;
  }

  &::before {
    position: absolute;
    bottom: 3px;
    left: 3px;
    content: '';
    width: 8px;
    height: 8px;
    border-bottom: 2px solid #fff;
    border-left: 2px solid #fff;
    border-radius: 2px;
  }
`;

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 100%;
  height: 100%;
  background-color: #f0f8ff;
  border-radius: 20px;
  border: 2px solid #f53838;
  gap: 10px;
  padding: 5px;
`;

export const CardTask: FC<CardProps> = ({
  headerText,
  hintHeaderText,
  isNeedDivider,
  questionText,
  optionText,
  subjectText,
  difficultyText,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const openHandle = () => setOpen(true);
  const closeHandle = () => setOpen(false);

  return (
    <CardWrapper>
      <StyledCardHeader>
        {headerText}
        {hintHeaderText && <HintHeader>{hintHeaderText}</HintHeader>}
        {isNeedDivider && <StyledHr />}
      </StyledCardHeader>
      <CardContentWrapper>
        <DialogueBlock>
          <FromMessage>
            Question: <TextMessage>{questionText}</TextMessage>
          </FromMessage>
          <FromMessage>
            Option: <TextMessage>{optionText}</TextMessage>
          </FromMessage>
          <hr />
          <FromMessage>
            Subject: <TextMessage>{subjectText}</TextMessage>
          </FromMessage>
          <FromMessage>
            Difficulty: <TextMessage>{difficultyText}</TextMessage>
          </FromMessage>
        </DialogueBlock>
      </CardContentWrapper>
      <StyledButton onClick={openHandle} />
      <Modal open={open} onClose={closeHandle}>
        <StyledModal>
          <ModalContentWrapper>
            <FromMessage>Question: </FromMessage>
            {questionText}
            <FromMessage>Option: </FromMessage>
            {optionText}
            <hr />
            <FromMessage>Subject: </FromMessage>
            {subjectText}
            <FromMessage>Difficulty: </FromMessage>
            {difficultyText}
          </ModalContentWrapper>
        </StyledModal>
      </Modal>
    </CardWrapper>
  );
};
