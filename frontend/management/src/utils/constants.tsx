import {Column} from "./types.tsx";

export const AssignmentTypes = {
  CODING: "Coding",
  MULTIPLE_CHOICE: "MultipleChoice",
  OPEN: "Open",
};

export const EmailTypes = {
  INVITATION: "invitation",
  REMINDER: "reminder",
};

export const Themes = {
  DARK: "dark",
  LIGHT: "light",
};

export const InviteStatuses = {
  APP_REMINDED_ONCE: "Applicant Reminded 1",
  APP_REMINDED_TWICE: "Applicant Reminded 2",
  EXPIRED: "Assessment Expired",
  NOT_STARTED: "Assessment Not Started",
  APP_STARTED: "Assessment In Progress",
  APP_FINISHED: "Assessment Finished",
  CANCELLED: "Cancelled",
};

export const PreferredLanguages = {
  JAVA: "Java",
  C_SHARP: "C#",
  SQL: "SQL",
  PYTHON: "Python"
}


export const Roles = {
  RECRUITER: "Recruiter",
  INTERVIEWER: "Interviewer",
  ADMIN: "Admin",
  NO_ACCESS: "-",
};

export const userColumns: Column[] = [
  {label: "Select", accessor: "select", sortable: false},
  {label: "Name", accessor: "name", sortable: true},
  {label: "Email", accessor: "email", sortable: true},
  {label: "Role", accessor: "role", sortable: true},
]

export const applicantColumns: Column[] = [
  {label: "Name", accessor: "name", sortable: true},
  {label: "Email", accessor: "email", sortable: true},
  {label: "Statuses", accessor: "statuses", sortable: false},
  {label: "Score", accessor: "score", sortable: true},
]

export const dashboardColumns: Column[] = [
  {label: "Name", accessor: "name", sortable: false},
  {label: "Email", accessor: "email", sortable: false},
  {label: "Score", accessor: "score", sortable: false},
]
