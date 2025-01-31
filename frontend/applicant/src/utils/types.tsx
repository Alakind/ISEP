import {AssignmentTypes} from "./constants";

export interface AssessmentInterface {
  sections: SectionInterface[];
  availableSeconds: number;
}

export interface SectionInterface {
  id: string;
  assignments: AssignmentInterface[];
  title: string;
}

export interface AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  description: string;
}

export interface AssignmentOpenInterface extends AssignmentInterface {
  answer: {
    type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
    answer: string
  };
}

export interface AssignmentMultipleChoiceInterface extends AssignmentInterface {
  options: string[];
  isMultipleAnswers: boolean;
  answer: {
    type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
    answer: string[]
  };
}

export interface AssignmentCodingInterface extends AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
  image: string;
  language: string;
  files: File[];
  startCode?: string;
  startTest?: string;
  answer: {
    type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
    code: string;
    test: string;
  };
}

export interface PreInfoInterface {
  name: string;
  availableSeconds: number;
}

export interface TestResultsInterface {
  name: string;
  result?: string;
  passed: boolean;
  code?: string;
}