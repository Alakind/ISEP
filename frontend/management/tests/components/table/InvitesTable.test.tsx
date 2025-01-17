import {render, screen} from "@testing-library/react";
import {InviteInterface} from "../../../src/utils/types.tsx";
import {MemoryRouter} from "react-router-dom";
import InvitesTable from "../../../src/components/table/InvitesTable.tsx";

describe('InvitesTable component', () => {
  const mockInvitesData: InviteInterface[] = [
    {
      id: "",
      applicantId: "",
      assessmentId: "",
      status: "",
      invitedAt: "",
      expiresAt: "",
      assessmentFinishedAt: new Date("2025-01-15T23:59:25.803Z"),
      assessmentStartedAt: new Date("2025-01-15T22:59:25.803Z"),
      measuredSecondsPerSection: [],
      scoredPoints: 0
    },
    {
      id: "",
      applicantId: "",
      assessmentId: "",
      status: "",
      invitedAt: "",
      expiresAt: "",
      assessmentFinishedAt: new Date("2025-01-15T23:59:25.803Z"),
      assessmentStartedAt: new Date("2025-01-15T22:59:25.803Z"),
      measuredSecondsPerSection: [],
      scoredPoints: 0
    },
  ];

  it('should render the applicant table with head and body', () => {
    render(
      <MemoryRouter>
        <InvitesTable data={mockInvitesData} dataApplicants={[]} columns={[]}/>
      </MemoryRouter>
    );

    expect(screen.getByTestId("invites-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-head-loading")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });
})