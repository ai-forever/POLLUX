import { createContext } from 'react';

export const EvaluationContext = createContext({
  data: [],
  criterias: [],
  search: (value: string) => {},
  setCriterias: (value: any) => {},
  setActive: (value: boolean) => {}, 
  taskSet: new Set(),
  difficultySet: new Set(),
  criteriaGroupSet: new Set(),
  activeCardId: null,
  setActiveCardId: (id: number) => {},
  promptText: '',
  modelAnswer: '',
  
});