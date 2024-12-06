import {ApplicantStatuses} from "./constants.tsx";

export function mapStatus(status: string): string {
  switch (status) {
    case "app_test_in_progress":
      return ApplicantStatuses.APP_ASSESSMENT_IN_PROGRESS
    case "app_finished":
      return ApplicantStatuses.APP_FINISHED
    case "app_invited_test":
      return ApplicantStatuses.APP_INVITED_ASSESSMENT
    case "app_invited_start":
      return ApplicantStatuses.APP_INVITED_START
    case "app_reminded":
      return ApplicantStatuses.APP_REMINDED
    case "test_expired":
      return ApplicantStatuses.ASSESSMENT_EXPIRED
    case "cancelled":
      return ApplicantStatuses.CANCELLED
    case "interview_finished":
      return ApplicantStatuses.INTERVIEW_FINISHED
    case "interview_invited":
      return ApplicantStatuses.INTERVIEW_INVITED
    case "not_started":
      return ApplicantStatuses.NOT_STARTED
    default:
      return "Unknown"
  }
}