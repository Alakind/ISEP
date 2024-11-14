import { AssignmentTypes } from "./constants";

export interface AssessmentInterface {
  sections: SectionInterface[];
}

export interface SectionInterface {
  name: string;
  assignments: AssignmentInterface[];
}

export interface AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
}

export interface AssignmentMultipleChoiceInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
  options: string[];
  isMultipleAnswers: boolean;
}
