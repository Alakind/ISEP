import {InviteStatuses, Roles} from "./constants.tsx";

export function mapStatus(status: string): string {
  switch (status) {
    case "app_finished":
      return InviteStatuses.APP_FINISHED
    case "app_started":
      return InviteStatuses.APP_STARTED
    case "app_reminded_once":
      return InviteStatuses.APP_REMINDED_ONCE
    case "app_reminded_twice":
      return InviteStatuses.APP_REMINDED_TWICE
    case "cancelled":
      return InviteStatuses.CANCELLED
    case "expired":
      return InviteStatuses.EXPIRED
    case "not_started":
      return InviteStatuses.NOT_STARTED
    default:
      return "Applicant Created"
  }
}

export function mapRole(role: string): string {
  switch (role) {
    case "admin":
      return Roles.ADMIN
    case "interviewer":
      return Roles.INTERVIEWER
    case "recruiter":
      return Roles.RECRUITER
    default:
      return Roles.NO_ACCESS
  }
}