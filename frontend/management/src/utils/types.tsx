import {ApplicantStatuses, PreferredLanguages, Roles} from "./constants";

export interface ApplicantInterface {
  id: string;
  name: string;
  email: string;
  status: (typeof ApplicantStatuses)[keyof typeof ApplicantStatuses];
  score: number;
  preferredLanguage: (typeof PreferredLanguages)[keyof typeof PreferredLanguages]
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: (typeof Roles)[keyof typeof Roles] | null;
}

export interface Column {
  label: string;
  accessor: string;
  sortable: boolean;
}