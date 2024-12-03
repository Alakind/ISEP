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
  APP_INVITED_START: "AppInvitedStart",
  APP_INVITED_ASSESSMENT: "AppInvitedAssessment",
  APP_REMINDED: "AppReminded",
  APP_ASSESSMENT_IN_PROGRESS: "AppAssessmentInProgress",
  ASSESSMENT_EXPIRED: "AssessmentExpired",
  APP_FINISHED: "ApplicantFinished",
  INTERVIEW_INVITED: "InterviewInvited",
  INTERVIEW_FINISHED: "InterviewFinished",
  CANCELLED: "Cancelled",
};

export const Roles = {
  RECRUITER: "Recruiter",
  INTERVIEWER: "Interviewer",
  ADMIN: "Admin",
  NO_ACCESS: "-",
};

export const userColumns: Column[] = [
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
