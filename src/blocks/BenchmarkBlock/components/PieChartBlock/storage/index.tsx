import { FC, useState } from 'react';
import { DataContext } from './context';
import {
  RechartsDataItem,
  transformedData,
} from '../data/convertFromJSONtoRechart';
import { TGroup } from '../../../../types';

interface PieChartProviderProps {
  children: React.ReactNode;
}

export const PieChartProvider: FC<PieChartProviderProps> = ({ children }) => {
  const [questionText, setQuestionText] = useState<string>('');
  const [optionText, setOptionText] = useState<string>('');
  const [difficultyText, setDifficultyText] = useState<string>('');
  const [subjectText, setSubjectText] = useState<string>('');
  const [dataPie, setDataPie] = useState(transformedData);
  const [selectedData, setSelectedData] = useState<RechartsDataItem>();
  const [text, setText] = useState<string>('');
  const [criterias, setCriterias] = useState<TGroup>();
  const [toggleState, setToggleState] = useState<boolean>(false);
  return (
    <DataContext.Provider
      value={{
        data: dataPie,
        questionText,
        optionText,
        difficultyText,
        subjectText,
        selectedData,
        setSelectedData,
        setDataPie,
        setQuestionText,
        setDifficultyText,
        setOptionText,
        setSubjectText,
        text,
        setText,
        criterias,
        setCriterias,
        setToggleState,
        toggleState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
