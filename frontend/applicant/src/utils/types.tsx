import { AssignmentTypes } from "./constants";

export interface AssessmentInterface {
  sections: SectionInterface[];
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

export interface AssignmentMultipleChoiceInterface extends AssignmentInterface {
  options: string[];
  isMultipleAnswers: boolean;
}

export interface AssignmentCodingInterface extends AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
  image: string;
  language: string;
  files: File[];
  startingCode?: string;
}

export interface AssignmentSolutionInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
}

export interface MultipleChoiceSolutionInterface
  extends AssignmentSolutionInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  answer: number[];
}

export interface OpenSolutionInterface extends AssignmentSolutionInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  answer: string;
}

export interface CodingSolutionInterface extends AssignmentSolutionInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  answer: {
    main: string;
    test: string;
  };
}
