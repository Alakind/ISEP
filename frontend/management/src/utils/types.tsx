import {ApplicantStatuses, PreferredLanguages, Roles} from "./constants";

export interface ApplicantInterface {
  id: string;
  name: string;
  email: string;
  status: (typeof ApplicantStatuses)[keyof typeof ApplicantStatuses];
  score?: number;
  preferredLanguage: typeof PreferredLanguages;
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: keyof typeof Roles;
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