import styled from 'styled-components';
import {
  BenchmarkBlock,
  ContentBlock,
  ContentWrapper,
  Header,
  NewsBlock,
} from './blocks';
import { EvaluationBlock } from './blocks/EvaluationBlock';
import { ButtonStyled, Carousel, Logo, Paragraph } from './components';
import {
  firstBlockFirstParagraph,
  firstBlockSecondParagraph,
  firstCarouselDescription,
  fourthBlockFirstParagraph,
  fourthBlockSecondParagraph,
  secondCarouselDescription,
  thirdBlockFirstParagraph,
  thirdBlockFourthParagraph,
  thirdBlockSecondParagraph,
  thirdBlockThirdParagraph,
  usageNoteFirstParagraph,
  usageNoteSecondParagraph,
  usageNoteThirdParagraph,
} from './constants/texts';
import './styles/App.css';

const StyledUsageNotesWithLinks = styled.div`
  font-size: clamp(0.9375rem, 0.7908rem + 0.5102vw, 1.25rem);
  font-weight: 400;
  text-align: left;

  @media (max-width: 500px) {
    width: 400px;
  }
`;

const StyledAuthors = styled.div`
  text-align: center;

  @media (max-width: 500px) {
    width: 400px;
  }
`;

const StyledButtonsLinkWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const StyledLinkButton = styled.a`
  display: flex;
  gap: 10px;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: calc(1em + 0.25em);
  padding-right: calc(1em + 0.25em);
  border-radius: 15px;
  background-color: #363636;
  border-color: transparent;
  color: #fff;
  text-decoration: none;
  transition: 0.5s transform ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const StyledSvgWrapper = styled.div`
  width: 12px;
  height: 20px;
`;

function App() {
  return (
    <>
      <Header />
      <ContentWrapper>
        <Logo />
        <ContentBlock
          headerText={`An Open-Source Framework for Assessing Russian-Speaking LLMs on Open-Ended Generative Tasks`}
        >
          <StyledAuthors>
            Nikita Martynov*(c), Anastasia Mordasheva*(c), Dmitriy Gorbetskiy*,
            Danil Astafurov*(c), Elina Basyrova*, Ulyana Isaeva, Sergey
            Skachkov, Victoria Berestova, Nikolay Ivanov, Valeriia Zanina, Anna
            Kostikova, Veniamin Sokolov and Alena Fenogenova
            <br />
            <br />
            Pollux team
            <br />
            <br />
            *Core contributors
            <br />
            <br />
            (c)Corresponding to:
            <br />
            <a href="mailto:nikita.martynov.98@list.ru">
              nikita.martynov.98@list.ru
            </a>
            <br />
            <a href="mailto:a.mordasheva@yandex.ru">a.mordasheva@yandex.ru</a>
            <br />
            <a href="mailto:danil31219as@gmail.com">danil31219as@gmail.com</a>
            <StyledButtonsLinkWrapper>
              <StyledLinkButton href="https://arxiv.org/pdf/2505.24616">
                <StyledSvgWrapper>
                  <svg
                    class="svg-inline--fa fa-file-pdf fa-w-12"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="file-pdf"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"
                    ></path>
                  </svg>
                </StyledSvgWrapper>
                arXiv
              </StyledLinkButton>
              <StyledLinkButton href="https://github.com/ai-forever/POLLUX">
                <StyledSvgWrapper>
                  <svg
                    class="svg-inline--fa fa-github fa-w-16"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="github"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                    ></path>
                  </svg>
                </StyledSvgWrapper>
                GitHub
              </StyledLinkButton>
              <StyledLinkButton href="https://huggingface.co/collections/ai-forever/pollux-68418d171bb9a4ac1e62b424">
                <StyledSvgWrapper>🤗</StyledSvgWrapper>
                HuggingFace
              </StyledLinkButton>
            </StyledButtonsLinkWrapper>
          </StyledAuthors>
          <Paragraph text={firstBlockFirstParagraph} />
          <Paragraph text={firstBlockSecondParagraph} />
          <Carousel
            nameCarousel="intro"
            descriptionText={firstCarouselDescription}
          ></Carousel>
        </ContentBlock>
        <ContentBlock id="news">
          <NewsBlock />
        </ContentBlock>
        <ButtonStyled href="#benchmark" text="Navigate benchmark" />
        <ContentBlock id="benchmark">
          <BenchmarkBlock />
          <ButtonStyled href="#evaluation" text="Human feedback" />
        </ContentBlock>
        <ContentBlock headerText="Human feedback" id="evaluation">
          <EvaluationBlock />
        </ContentBlock>
        <ContentBlock headerText="Benchmark statistics" id="statistics">
          <Carousel
            nameCarousel="benchStats"
            descriptionText={secondCarouselDescription}
          ></Carousel>
          <Paragraph text={thirdBlockFirstParagraph} />
          <Paragraph text={thirdBlockSecondParagraph} />
          <Paragraph text={thirdBlockThirdParagraph} />
          <Paragraph text={thirdBlockFourthParagraph} />
        </ContentBlock>
        <ContentBlock headerText="Benchmark experts" id="experts">
          <Paragraph text={fourthBlockFirstParagraph} />
          <Paragraph text={fourthBlockSecondParagraph} />
          <Carousel nameCarousel="experts" />
        </ContentBlock>
        <ContentBlock headerText="Usage notes" id="notes">
          <Paragraph text={usageNoteFirstParagraph} />
          <Paragraph text={usageNoteSecondParagraph} />
          <Paragraph text={usageNoteThirdParagraph} />
          <StyledUsageNotesWithLinks>
            For detailed examples and implementation guidance on using POLLUX
            LM-as-a-Judge models, please refer to the{' '}
            <a href="https://huggingface.co/collections/ai-forever/pollux-68418d171bb9a4ac1e62b424">
              Hugging Face collection
            </a>
            <span>&nbsp;</span>and the<span>&nbsp;</span>
            <a href="https://github.com/ai-forever/POLLUX">GitHub repository</a>
          </StyledUsageNotesWithLinks>
        </ContentBlock>
        <ContentBlock headerText="Citation" id="citation">
          <StyledUsageNotesWithLinks>
            @misc
            {`{
  martynov2025eyejudgementdissectingevaluation, title={Eye of Judgement: Dissecting the Evaluation of Russian-speaking LLMs with POLLUX}, 
  author={Nikita Martynov and Anastasia Mordasheva and Dmitriy Gorbetskiy and Danil Astafurov and Ulyana Isaeva and Elina Basyrova and Sergey Skachkov and Victoria Berestova and Nikolay Ivanov and Valeriia Zanina and Alena Fenogenova},
  year={2025},
  eprint={2505.24616},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2505.24616}}`}
          </StyledUsageNotesWithLinks>
        </ContentBlock>
      </ContentWrapper>
    </>
  );
}

export default App;
