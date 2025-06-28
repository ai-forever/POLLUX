import { createContext } from 'react';
import { RechartsDataItem } from '../data/convertFromJSONtoRechart';
import { TGroup } from '../types/pieChartTypes';

export const DataContext = createContext({
  data: {},
  indexData: 0,
  selectedData: {},
  setSelectedData: (value: RechartsDataItem) => {},
  instructionText: '',
  optionText: '',
  difficultyText: '',
  domainText: '',
  text: '',
  criterias: {},
  toggleState: false,
  setToggleState: (value: boolean) => {},
  setCriterias: (value: TGroup) => {},
  setText: (value: string) => {},
  setInstructionText: (value: string) => {},
  setOptionText: (value: string) => {},
  setDifficultyText: (value: string) => {},
  setDomainText: (value: string) => {},
});
