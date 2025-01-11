import {InviteStatuses} from "./constants.tsx";

export function canCancelInvite(status: string): boolean {
  switch (status) {
    case InviteStatuses.NOT_STARTED:
      return true;
    case InviteStatuses.CANCELLED:
      return false;
    case InviteStatuses.EXPIRED:
      return false;
    case InviteStatuses.APP_REMINDED_ONCE:
      return true;
    case InviteStatuses.APP_REMINDED_TWICE:
      return true;
    case InviteStatuses.APP_STARTED:
      return false;
    case InviteStatuses.APP_FINISHED:
      return false;
    default:
      return false;
  }
}

export function canDeleteInvite(status: string): boolean {
  switch (status) {
    case InviteStatuses.NOT_STARTED:
      return true;
    case InviteStatuses.CANCELLED:
      return true;
    case InviteStatuses.EXPIRED:
      return true;
    case InviteStatuses.APP_REMINDED_ONCE:
      return true;
    case InviteStatuses.APP_REMINDED_TWICE:
      return true;
    case InviteStatuses.APP_STARTED:
      return false;
    case InviteStatuses.APP_FINISHED:
      return false;
    default:
      return false;
  }
}

export function canRemindInvite(status: string): boolean {
  switch (status) {
    case InviteStatuses.NOT_STARTED:
      return true;
    case InviteStatuses.CANCELLED:
      return false;
    case InviteStatuses.EXPIRED:
      return false;
    case InviteStatuses.APP_REMINDED_ONCE:
      return true;
    case InviteStatuses.APP_REMINDED_TWICE:
      return false;
    case InviteStatuses.APP_STARTED:
      return false;
    case InviteStatuses.APP_FINISHED:
      return false;
    default:
      return false;
  }
}

export function testUuidValidity(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return uuidRegex.test(id);
}

export function scrollToAssignment(id: string) {
  const assignmentElement: HTMLElement | null = document.getElementById(id);
  if (assignmentElement) {
    assignmentElement.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
  }
}

export function getDateFormatted(inputDate: string): string {
  const date: Date = new Date(inputDate);

  const yyyy: number = date.getFullYear();
  const mm: string = String(date.getMonth() + 1).padStart(2, '0');
  const dd: string = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}