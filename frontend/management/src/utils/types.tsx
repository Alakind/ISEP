import { ApplicantStatuses, Roles } from "./constants";

export interface ApplicantInterface {
  name: string;
  surname: string;
  id: string;
  email: string;
  status: (typeof ApplicantStatuses)[keyof typeof ApplicantStatuses];
  score: number;
}

export interface UserInterface {
  name: string;
  email: string;
  id: string;
  role: (typeof Roles)[keyof typeof Roles] | null;
  access?: boolean; //FIXME remove this one
}

export interface Column {
  label: string;
  accessor: string;
  sortable: boolean;
}