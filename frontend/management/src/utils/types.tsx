import {AssignmentTypes, InviteStatuses, PreferredLanguages, Roles} from "./constants";

export interface ApplicantInterface {
  id: string;
  name: string;
  email: string;
  statuses?: (typeof InviteStatuses)[keyof typeof InviteStatuses][];
  score?: number;
  preferredLanguage: (typeof PreferredLanguages)[keyof typeof PreferredLanguages];
  invites?: string[];
}

export interface InviteInterface {
  id: string;
  applicantId: string;
  assessmentId: string;
  status: (typeof InviteStatuses)[keyof typeof InviteStatuses];
  invitedAt: string;
  expiredAt: string;
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: (typeof Roles)[keyof typeof Roles];
}

export interface Column {
  label: string;
  accessor: string;
  sortable: boolean;
}

export interface Selection {
  id: string;
  checked: boolean;
}

export interface AssessmentInterface {
  id: string;
  tag: string;
  sections: number[]
}

export interface SectionInterface {
  id: string;
  assignments: AssignmentInterface[];
  title: string;
}

export interface SectionSolvedInterface {
  id: string;
  assignments: AssignmentSolvedInterface[];
  title: string;
}

export interface AssignmentSolvedInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  description: string;
  answer: { type: string; answer: string };
}

export interface AssignmentMultipleChoiceSolvedInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  description: string;
  options: string[];
  isMultipleAnswers: boolean;
  answer: { type: string; answer: number[] };
}

export interface AssignmentCodingSolvedInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
  image: string;
  files: File[];
  answer: { type: string; answer: File[] };
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
  isMultipleAnswers: boolean;
}

export interface AssignmentCodingInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  isSolved: boolean;
  text: string;
  image: string;
  files: File[];
}