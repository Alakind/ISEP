import {mapRole, mapStatus} from '../../src/utils/mapping.tsx';
import {InviteStatuses, Roles} from "../../src/utils/constants";

test('mapStatus should map API status value to react statuses', (): void => {
  expect(mapStatus("app_finished")).toBe(InviteStatuses.APP_FINISHED);
  expect(mapStatus("app_started")).toBe(InviteStatuses.APP_STARTED);
  expect(mapStatus("app_reminded_once")).toBe(InviteStatuses.APP_REMINDED_ONCE);
  expect(mapStatus("app_reminded_twice")).toBe(InviteStatuses.APP_REMINDED_TWICE);
  expect(mapStatus("cancelled")).toBe(InviteStatuses.CANCELLED);
  expect(mapStatus("expired")).toBe(InviteStatuses.EXPIRED);
  expect(mapStatus("not_started")).toBe(InviteStatuses.NOT_STARTED);
  expect(mapStatus(InviteStatuses.APP_FINISHED)).toBe("app_finished");
  expect(mapStatus(InviteStatuses.APP_STARTED)).toBe("app_started");
  expect(mapStatus(InviteStatuses.APP_REMINDED_ONCE)).toBe("app_reminded_once");
  expect(mapStatus(InviteStatuses.APP_REMINDED_TWICE)).toBe("app_reminded_twice");
  expect(mapStatus(InviteStatuses.CANCELLED)).toBe("cancelled");
  expect(mapStatus(InviteStatuses.EXPIRED)).toBe("expired");
  expect(mapStatus(InviteStatuses.NOT_STARTED)).toBe("not_started");
  expect(mapStatus("adsfaskfaslkfj")).toBe("Applicant Created");
  expect(mapStatus("")).toBe("Applicant Created");
})

test('mapRole should map API role value to react roles', (): void => {
  expect(mapRole("admin")).toBe(Roles.ADMIN);
  expect(mapRole("interviewer")).toBe(Roles.INTERVIEWER);
  expect(mapRole("recruiter")).toBe(Roles.RECRUITER);
  expect(mapRole("adsfaskfaslkfj")).toBe(Roles.NO_ACCESS);
  expect(mapRole("")).toBe(Roles.NO_ACCESS);
})