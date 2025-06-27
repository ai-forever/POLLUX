import {
  BenchmarkBlock,
  ContentBlock,
  ContentWrapper,
  Header,
  NewsBlock,
} from './blocks';
import { EvaluationBlock } from './blocks/EvaluationBlock';
import {
  ButtonStyled,
  Carousel,
  CustomImage,
  Logo,
  Paragraph,
} from './components';
import {
  firstBlockFirstParagraph,
  firstBlockSecondParagraph,
  firstBlockThirdParagraph,
  firstCarouselDescription,
  secondBlockFirstParagraph,
  secondCarouselDescription,
  thirdBlockFirstParagraph,
} from './constants/texts';
import './styles/App.css';
import testPhoto from './assets/demoTest.jpg';
import { ExpertsBlock } from './blocks/ExpertsBlock';

function App() {
  return (
    <>
      <Header />
      <ContentWrapper>
        <Logo />
        <ContentBlock
          headerText={`Description of a benchmark, letter by letter, maybe history of ${'\n'} naming`}
        >
          <Paragraph text={firstBlockFirstParagraph} />
          <Paragraph text={firstBlockSecondParagraph} />
          <Carousel descriptionText={firstCarouselDescription}></Carousel>
        </ContentBlock>
        <ContentBlock>
          <Paragraph text={firstBlockThirdParagraph}></Paragraph>
        </ContentBlock>
        <ContentBlock id="news">
          <NewsBlock />
        </ContentBlock>
        {/* Убрали по требованию заказчика, может вернем */}
        {/* <ContentBlock
          headerText="Comparisons with Existing Benchmarks"
          id="comprasions"
        >
          <Paragraph text={secondBlockFirstParagraph} />
          <Carousel descriptionText={secondCarouselDescription}></Carousel>
        </ContentBlock> */}
        <ButtonStyled href="#benchmark" text="Navigate benchmark" />
        <ContentBlock id="benchmark">
          <BenchmarkBlock />
          <ButtonStyled href="#evaluation" text="Evaluation result" />
        </ContentBlock>
        <ContentBlock headerText="Evaluation result" id="evaluation">
          <EvaluationBlock />
        </ContentBlock>
        <ContentBlock headerText="Benchmark statistics" id="statistics">
          <Carousel descriptionText={secondCarouselDescription}></Carousel>
          <Paragraph text={thirdBlockFirstParagraph} />
        </ContentBlock>
        <ContentBlock headerText="Benchmark experts" id="experts">
          <Paragraph text={secondBlockFirstParagraph} />
          <Carousel descriptionText={secondCarouselDescription}></Carousel>

          <ExpertsBlock />
        </ContentBlock>
        <ContentBlock headerText="Usage notes" id="notes">
          тут пока пусто
        </ContentBlock>
        <ContentBlock headerText="Citation" id="citation">
          тут пока пусто
        </ContentBlock>
      </ContentWrapper>
    </>
  );
}

export default App;
