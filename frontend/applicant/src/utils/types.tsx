import { AssignmentTypes } from "./constants";

export interface SectionInterface {
  assignments: AssignmentInterface[];
}

export interface AssignmentInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string[];
}

export interface AssignmentMultipleChoiceInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string[];
  options: string[];
}
