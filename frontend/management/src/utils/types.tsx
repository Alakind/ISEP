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
  expiresAt: string;
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
  measuredTime?: string;
  suggestedTime?: string;
  scoredPoints: number | null;
  availablePoints: number;
  size: number;
}

export interface AssignmentSolvedInterface {
  id: string;
  type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
  description: string;
  scoredPoints: number | null;
  availablePoints: number;
}

export interface AssignmentOpenSolvedInterface extends AssignmentSolvedInterface {
  answer: { type: string; answer: string };
  referenceAnswer: { type: string; answer: string };
}

export interface AssignmentMultipleChoiceSolvedInterface extends AssignmentSolvedInterface {
  options: string[];
  isMultipleAnswers: boolean;
  answer: { type: string; answer: number[] };
  referenceAnswer: { type: string; answer: number[] };
}

export interface AssignmentCodingSolvedInterface extends AssignmentSolvedInterface {
  image?: string;
  codeUri: string;
  language: string;
  answer: { type: string; answer: string };
  referenceAnswer: { type: string; answer: string };
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
  image: string;
  files: File[];
}

export interface BarChartInterface {
  percentage: string;
  barGroups: BarGroupInterface[];
}

export interface BarGroupInterface {
  value: string;
  isSelected: boolean;
}

export interface SkillsInterface {
  title: string;
  scoredPoints: number | null;
  availablePoints: number;
}

export interface ScoredAssessmentInterface {
  scoredPoints: number;
  availablePoints: number;
}