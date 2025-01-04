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