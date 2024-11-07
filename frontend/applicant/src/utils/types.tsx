import { AssignmentTypes } from "./constants";

export interface InterviewInterface {
  sections: SectionInterface[];
}

export interface SectionInterface {
  assignments: AssignmentInterface[];
  title: string;
  id: string;
}

export interface AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  description: string;
}

export interface AssignmentMultipleChoiceInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  description: string;
  options: string[];
}
