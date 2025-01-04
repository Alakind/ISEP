import {describe, expect, test} from "vitest";
import {applicantColumns, AssignmentTypes, InviteStatuses, PreferredLanguages, Roles, Themes, userColumns} from "../../src/utils/constants";
import {Column} from "../../src/utils/types";

test('AssignmentTypes', (): void => {
  expect(AssignmentTypes.CODING).toBe("Coding");
  expect(AssignmentTypes.MULTIPLE_CHOICE).toBe("MultipleChoice");
  expect(AssignmentTypes.OPEN).toBe("Open");
})

test('Themes', (): void => {
  expect(Themes.DARK).toBe("dark");
  expect(Themes.LIGHT).toBe("light");
})

test('InviteStatuses', (): void => {
  expect(InviteStatuses.APP_REMINDED_ONCE).toBe("Applicant Reminded 1");
  expect(InviteStatuses.APP_REMINDED_TWICE).toBe("Applicant Reminded 2");
  expect(InviteStatuses.EXPIRED).toBe("Assessment Expired");
  expect(InviteStatuses.NOT_STARTED).toBe("Assessment Not Started");
  expect(InviteStatuses.APP_STARTED).toBe("Assessment In Progress");
  expect(InviteStatuses.APP_FINISHED).toBe("Assessment Finished");
  expect(InviteStatuses.CANCELLED).toBe("Cancelled");
})

test('PreferredLanguages', (): void => {
  expect(PreferredLanguages.JAVA).toBe("Java");
  expect(PreferredLanguages.C_SHARP).toBe("C#");
  expect(PreferredLanguages.SQL).toBe("SQL");
  expect(PreferredLanguages.PYTHON).toBe("Python");
})

test('Roles', (): void => {
  expect(Roles.RECRUITER).toBe("Recruiter");
  expect(Roles.INTERVIEWER).toBe("Interviewer");
  expect(Roles.ADMIN).toBe("Admin");
  expect(Roles.NO_ACCESS).toBe("-");
})

const validateColumn = (columns: Column[], expectedColumns: Column[]) => {
  expect(columns).toHaveLength(expectedColumns.length);

  columns.forEach((column, index) => {
    const expected = expectedColumns[index];
    expect(column.label).toBe(expected.label);
    expect(column.accessor).toBe(expected.accessor);
    expect(column.sortable).toBe(expected.sortable);
  });
};

describe("Column Configurations", () => {
  test("should have the correct userColumns configuration", () => {
    const expectedUserColumns = [
      {label: "Select", accessor: "select", sortable: false},
      {label: "Name", accessor: "name", sortable: true},
      {label: "Email", accessor: "email", sortable: true},
      {label: "Role", accessor: "role", sortable: true},
    ];

    validateColumn(userColumns, expectedUserColumns);
  });

  test("should have the correct applicantColumns configuration", () => {
    const expectedApplicantColumns = [
      {label: "Name", accessor: "name", sortable: true},
      {label: "Email", accessor: "email", sortable: true},
      {label: "Statuses", accessor: "statuses", sortable: false},
      {label: "Score", accessor: "score", sortable: true},
    ];

    validateColumn(applicantColumns, expectedApplicantColumns);
  });
});