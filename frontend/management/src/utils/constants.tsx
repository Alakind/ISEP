import {Column} from "./types.tsx";

export const AssignmentTypes = {
  CODING: "Coding",
  MULTIPLE_CHOICE: "MultipleChoice",
  OPEN: "Open",
};

export const Themes = {
  DARK: "dark",
  LIGHT: "light",
};

export const ApplicantStatuses = {
  APP_INVITED_START: "Applicant Invited (Phase 1)",
  APP_INVITED_ASSESSMENT: "Applicant Invited (Phase 2)",
  APP_REMINDED: "Applicant Reminded",
  ASSESSMENT_EXPIRED: "Assessment Expired",
  NOT_STARTED: "Assessment Not Started",
  APP_ASSESSMENT_IN_PROGRESS: "Assessment In Progress",
  APP_FINISHED: "Applicant Finished",
  INTERVIEW_INVITED: "Interview Invited",
  INTERVIEW_FINISHED: "Interview Finished",
  CANCELLED: "Cancelled",
  APP_CREATED: "Applicant Created",
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
  {label: "Status", accessor: "status", sortable: true},
  {label: "Score", accessor: "score", sortable: true},
]

export const dashboardColumns: Column[] = [
  {label: "Name", accessor: "name", sortable: false},
  {label: "Email", accessor: "email", sortable: false},
  {label: "Score", accessor: "score", sortable: false},
]
