import { FC, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CardCustom } from '../../../../components';
import { Box, } from '@mui/material';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { DataContext } from './storage/context';
import { RechartsDataItem } from './data/convertFromJSONtoRechart';

const PieChartBlockWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
  width: 360px;
`;

export const PiechartBlock: FC = () => {
  const {
    data,
    setSelectedData,
    setDifficultyText,
    setOptionText,
    setQuestionText,
    setSubjectText,
    setText,
    setCriterias,
    setToggleState,
  } = useContext(DataContext);
  const [storyData, setStoryData] = useState<Array<RechartsDataItem>>([]);
  const [activeData, setActiveData] = useState<Array<string>>([]);

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A28CFF',
    '#FF6699',
    '#33CCFF',
    '#FF9933',
    '#66CC66',
    '#CC3366',
    '#FF6666',
    '#6699FF',
    '#9966FF',
    '#00B3B3',
    '#FFB3CC',
    '#FFCC00',
    '#B3FF66',
    '#66FFB3',
    '#FF33CC',
  ];

  useEffect(() => {
    setStoryData([data]);
  }, []);

  // если нет children у последнего элемента, то показываем тоглы
  const checkChildren = (element: RechartsDataItem) => {
    if (typeof element.payload.children === 'undefined') {
      setToggleState(false);
    } else {
      setToggleState(true);
    }
  };

  const setAllContent = (element: RechartsDataItem) => {
    setOptionText(element.option);
    setQuestionText(element.question);
    setDifficultyText(element.difficulty);
    setSubjectText(element.subject);
    setActiveData([...activeData, element.name]);
    setText(element.text);
    setCriterias(element.criteria);
  };

  const handleBackwardStep = () => {
    setStoryData((prevItems) => prevItems.slice(0, -1)); // удаляем последний элемент
  };

  const handleClick = (element: RechartsDataItem) => {
    checkChildren(element);
    setAllContent(element);
    if (element.children.length > 0) {
      setStoryData([...storyData, element.children]);
      setSelectedData(storyData[setStoryData.length - 1]);
    }
  };

  const displayedData =
    activeData.length > 0 ? storyData[storyData.length - 1] : data;

  return (
    <PieChartBlockWrapper>
      <CardCustom
        headerText="Navigate benchmark"
        hintHeaderText="Hover over/tap a segment to view the details"
        isNeedDivider
      >
        {storyData.length > 1 && (
          <button onClick={handleBackwardStep}>Back</button>
        )}
        <PieChart width={300} height={300}>
          <Pie
            data={displayedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            onClick={handleClick}
          >
            {displayedData.map((_: never, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </CardCustom>
    </PieChartBlockWrapper>
  );
};
