import { createContext } from 'react';
import { RechartsDataItem } from '../data/convertFromJSONtoRechart';
import { TGroup } from '../types/pieChartTypes';

export const DataContext = createContext({
  data: {},
  indexData: 0,
  selectedData: {},
  setSelectedData: (value: RechartsDataItem) => {},
  questionText: '',
  optionText: '',
  difficultyText: '',
  subjectText: '',
  text: '',
  criterias: {},
  toggleState: false,
  setToggleState: (value: boolean) => {},
  setCriterias: (value: TGroup) => {},
  setText: (value: string) => {},
  setQuestionText: (value: string) => {},
  setOptionText: (value: string) => {},
  setDifficultyText: (value: string) => {},
  setSubjectText: (value: string) => {},
});
