import {render, screen} from "@testing-library/react";
import {vi} from "vitest";
import {InviteStatuses, PreferredLanguages} from "../../../src/utils/constants.tsx";
import {ApplicantInterface, InviteInterface} from "../../../src/utils/types.tsx";
import DashboardList from "../../../src/components/dashboard/DashboardList.tsx";
import {MemoryRouter} from "react-router-dom";

vi.mock("../../../src/containers/dashboard/InvitesTableContainer.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked InvitesTableContainer</div>),
  };
});

describe("DashboardList", () => {
  const mockDataApplicants: ApplicantInterface[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      preferredLanguage: PreferredLanguages.JAVA
    },
  ];

  const mockDataFinished: InviteInterface[] = [
    {
      scoredPoints: 90,
      status: InviteStatuses.APP_FINISHED,
      assessmentFinishedAt: "2025-01-15T00:00:00Z",
      expiresAt: "2025-01-20T00:00:00Z",
      id: "",
      applicantId: "",
      assessmentId: "",
      invitedAt: "",
      assessmentStartedAt: undefined,
      measuredSecondsPerSection: []
    },
  ];

  const mockDataExpired: InviteInterface[] = [
    {
      scoredPoints: 50,
      status: InviteStatuses.EXPIRED,
      assessmentFinishedAt: "2025-01-10T00:00:00Z",
      expiresAt: "2025-01-15T00:00:00Z",
      id: "",
      applicantId: "",
      assessmentId: "",
      invitedAt: "",
      assessmentStartedAt: "2025-01-09T00:00:00Z",
      measuredSecondsPerSection: []
    },
  ];

  const mockDataWillExpire: InviteInterface[] = [
    {
      scoredPoints: 70,
      status: InviteStatuses.APP_REMINDED_TWICE,
      assessmentFinishedAt: "2025-01-18T00:00:00Z",
      expiresAt: "2025-01-22T00:00:00Z",
      id: "",
      applicantId: "",
      assessmentId: "",
      invitedAt: "",
      assessmentStartedAt: undefined,
      measuredSecondsPerSection: []
    },
  ];

  it("should render finished assessments section when data is available", () => {
    render(
      <MemoryRouter>
        <DashboardList
          dataApplicants={mockDataApplicants}
          dataFinished={mockDataFinished}
          dataExpired={[]}
          dataWillExpire={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Finished assessments in the last week")).toBeInTheDocument();
    expect(screen.getByText("Mocked InvitesTableContainer")).toBeInTheDocument();
  });

  it("should render expired invites section when data is available", () => {
    render(
      <MemoryRouter>
        <DashboardList
          dataApplicants={mockDataApplicants}
          dataFinished={[]}
          dataExpired={mockDataExpired}
          dataWillExpire={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Expired invites")).toBeInTheDocument();
    expect(screen.getByText("Mocked InvitesTableContainer")).toBeInTheDocument();
  });

  it("should render will expire invites section when data is available", () => {
    render(
      <MemoryRouter>
        <DashboardList
          dataApplicants={mockDataApplicants}
          dataFinished={[]}
          dataExpired={[]}
          dataWillExpire={mockDataWillExpire}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Invites that will expire in 2 days")).toBeInTheDocument();
    expect(screen.getByText("Mocked InvitesTableContainer")).toBeInTheDocument();
  });

  it("should render 'No data available' when no finished data is present", () => {
    render(
      <MemoryRouter>
        <DashboardList
          dataApplicants={mockDataApplicants}
          dataFinished={[]}
          dataExpired={[]}
          dataWillExpire={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Finished assessments in the last week")).toBeInTheDocument();
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
