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
  role: (typeof Roles)[keyof typeof Roles];
}
