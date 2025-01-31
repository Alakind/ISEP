import {fireEvent, render, screen} from "@testing-library/react";
import {vi} from "vitest";
import {act} from "react";
import TableRowInvites from "../../../src/components/table/TableRowInvites.tsx";
import {ApplicantInterface, Column, InviteInterface} from "../../../src/utils/types.tsx";

describe("TableRowInvites", () => {
  const mockGoToApplicantPage = vi.fn();
  const mockApplicantData: ApplicantInterface = {
    preferredLanguage: "Kotlin",
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com"
  };


  const mockInviteDataFinished: InviteInterface = {
    id: "invite1",
    assessmentId: "1",
    applicantId: "1",
    invitedAt: "2025-01-10T00:00:00Z",
    scoredPoints: 75,
    availablePoints: 124,
    status: "app_finished",
    assessmentStartedAt: "2025-01-14T00:00:00Z",
    assessmentFinishedAt: "2025-01-15T00:00:00Z",
    expiresAt: "2025-01-14T00:00:00Z",
    measuredSecondsPerSection: [0]
  };


  const mockInviteDataExpired: InviteInterface = {
    id: "invite1",
    assessmentId: "1",
    applicantId: "1",
    invitedAt: "2025-01-10T00:00:00Z",
    scoredPoints: 75,
    availablePoints: 124,
    status: "expired",
    assessmentStartedAt: "2025-01-14T00:00:00Z",
    assessmentFinishedAt: "2025-01-15T00:00:00Z",
    expiresAt: "2025-01-14T00:00:00Z",
    measuredSecondsPerSection: [0]
  };

  const mockInviteDataWillExpire: InviteInterface = {
    id: "invite1",
    assessmentId: "1",
    applicantId: "1",
    invitedAt: "2025-01-10T00:00:00Z",
    scoredPoints: 75,
    availablePoints: 124,
    status: "reminder_once",
    assessmentStartedAt: "2025-01-14T00:00:00Z",
    assessmentFinishedAt: "2025-01-15T00:00:00Z",
    expiresAt: "2025-01-20T00:00:00Z",
    measuredSecondsPerSection: [0]
  };

  const mockColumnsFinished: Column[] = [
    {label: "Name", accessor: "name", sortable: false},
    {label: "Email", accessor: "email", sortable: false},
    {label: "Status", accessor: "status", sortable: false},
    {label: "Score", accessor: "score", sortable: false},
    {label: "Date", accessor: "date", sortable: false},
  ]

  const mockColumnsExpired: Column[] = [
    {accessor: "name", label: "Name", sortable: false},
    {accessor: "email", label: "Email", sortable: false},
    {accessor: "days", label: "Expired Days", sortable: false},
  ];

  const mockColumnsWillExpire: Column[] = [
    {accessor: "name", label: "Name", sortable: false},
    {accessor: "status", label: "Status", sortable: false},
    {accessor: "email", label: "Email", sortable: false},
    {accessor: "days", label: "Will Expire In Days", sortable: false},
  ];

  it("should render the table row with correct data for finished invites table", () => {
    render(
      <table>
        <tbody>
        <TableRowInvites
          inviteData={mockInviteDataFinished}
          applicantData={mockApplicantData}
          columns={mockColumnsFinished}
          goToApplicantPage={mockGoToApplicantPage}
          today={new Date("2025-01-16T00:00:00Z")}
        />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("75/124")).toBeInTheDocument();
    expect(screen.getByText("Wed, 15 Jan 2025 00:00:00 GMT")).toBeInTheDocument();
  });

  it("should render the table row with correct data for expired invites table", () => {
    render(
      <table>
        <tbody>
        <TableRowInvites
          inviteData={mockInviteDataExpired}
          applicantData={mockApplicantData}
          columns={mockColumnsExpired}
          goToApplicantPage={mockGoToApplicantPage}
          today={new Date("2025-01-16T00:00:00Z")}
        />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();

    const expirationDate: number = new Date(mockInviteDataExpired.expiresAt).valueOf();
    const diffInMilliseconds: number = new Date("2025-01-16T00:00:00Z").valueOf() - expirationDate;
    const diffInDays: number = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    expect(screen.getByText(diffInDays)).toBeInTheDocument();
  });

  it("should render the table row with correct data for will expire invites table", () => {
    render(
      <table>
        <tbody>
        <TableRowInvites
          inviteData={mockInviteDataWillExpire}
          applicantData={mockApplicantData}
          columns={mockColumnsWillExpire}
          goToApplicantPage={mockGoToApplicantPage}
          today={new Date("2025-01-16T00:00:00Z")}
        />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();

    const expirationDate: number = new Date(mockInviteDataWillExpire.expiresAt).valueOf();
    const diffInMilliseconds: number = new Date("2025-01-16T00:00:00Z").valueOf() - expirationDate;
    const diffInDays: number = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    expect(screen.getByText(-1 * diffInDays)).toBeInTheDocument();
  });

  it("should call goToApplicantPage when name is clicked", async () => {
    render(
      <table>
        <tbody>
        <TableRowInvites
          inviteData={mockInviteDataExpired}
          applicantData={mockApplicantData}
          columns={mockColumnsExpired}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const nameCell = screen.getByText("John Doe");
    await act(async () => fireEvent.click(nameCell));

    expect(mockGoToApplicantPage).toHaveBeenCalledWith("1");
  });
});
