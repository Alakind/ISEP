import {ApplicantInterface, InviteInterface, UserInterface,} from "../../src/utils/types";
import {InviteStatuses, Roles} from "../../src/utils/constants";

describe("Interface Compliance", () => {
  it("should match ApplicantInterface structure", () => {
    const applicant: ApplicantInterface = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      preferredLanguage: "Java",
      invites: ["invite1-uuid", "invite2-uuid"],
    };
    expect(expectTypeOf(applicant).toMatchTypeOf<ApplicantInterface>()).toBe(true);
  });

  it("should match InviteInterface structure", () => {
    const invite: InviteInterface = {
      id: "invite1-uuid",
      applicantId: "1",
      assessmentId: "2",
      status: InviteStatuses.EXPIRED,
      invitedAt: "2024-01-01T12:00:00Z",
      expiresAt: "2024-01-10T12:00:00Z",
      measuredSecondsPerSection: []
    };
    expect(expectTypeOf(invite).toMatchTypeOf<InviteInterface>()).toBe(true);
  });

  it("should match UserInterface structure", () => {
    const user: UserInterface = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: Roles.ADMIN,
      oid: ""
    };
    expect(expectTypeOf(user).toMatchTypeOf<UserInterface>()).toBe(true);
  });

  //Column

  //Selection

  //AssessmentInterface

  //SectionInterface

  //SectionSolvedInterface

  //AssignmentSolvedInterface

  //AssignmentOpenSolvedInterface

  //AssignmentMultipleChoiceSolvedInterface

  //AssignmentCodingSolvedInterface

  //AssignmentMultipleChoiceInterface

  //AssignmentCodingInterface

  //BarChartInterface

  //BarGroupInterface

  //SkillsInterface

  //ScoredAssessmentInterface
});
