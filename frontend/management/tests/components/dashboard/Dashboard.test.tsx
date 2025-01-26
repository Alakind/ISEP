import {render, screen} from "@testing-library/react";
import Dashboard from "../../../src/components/dashboard/Dashboard.tsx";
import {vi} from "vitest";
import {Roles} from "../../../src/utils/constants.tsx";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";

vi.mock("../../../src/containers/dashboard/DashboardStatisticsContainer.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardStatisticsContainer</div>),
  };
});

vi.mock("../../../src/containers/dashboard/DashboardQuickLinksContainer.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardQuickLinksContainer</div>),
  };
});

vi.mock("../../../src/containers/dashboard/DashboardListContainer.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardListContainer</div>),
  };
});

vi.mock("../../../src/containers/card/CardBodyContainer.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(({children}) => <div className="MockedCardBodyContainer">{children}</div>),
  };
});

vi.mock("../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

describe("Dashboard", () => {
  const mockSetTotalApplicants = vi.fn();
  const mockSetTotalWillExpire = vi.fn();
  const mockSetTotalExpired = vi.fn();

  it("should render the dashboard without any components, because no access", () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "Jay", oid: "", role: ""});
    render(
      <Dashboard
        totalApplicants={100}
        setTotalApplicants={mockSetTotalApplicants}
        totalWillExpire={25}
        setTotalWillExpire={mockSetTotalWillExpire}
        totalExpired={10}
        setTotalExpired={mockSetTotalExpired}
        currentUser={"Jay"}
      />
    );

    expect(screen.getByText("Welcome Jay")).toBeInTheDocument();

    expect(
      screen.getByText(
        "It seems that you don't have a role yet. Please ask an admin to assign you the appropriate role. Until then you can't access any information."
      )
    ).toBeInTheDocument();


    expect(screen.queryByText("Mocked DashboardStatisticsContainer")).not.toBeInTheDocument();
    expect(screen.queryByText("Mocked DashboardQuickLinksContainer")).not.toBeInTheDocument();
    expect(screen.queryByText("Mocked DashboardListContainer")).not.toBeInTheDocument();
  });

  it("should render the dashboard with all components (admin role)", () => {
    render(
      <Dashboard
        totalApplicants={100}
        setTotalApplicants={mockSetTotalApplicants}
        totalWillExpire={25}
        setTotalWillExpire={mockSetTotalWillExpire}
        totalExpired={10}
        setTotalExpired={mockSetTotalExpired}
        currentUser={""}
      />
    );

    expect(screen.getByText("Welcome")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the Applicants page. To view the roles of users navigate to the Users page."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Mocked DashboardStatisticsContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardQuickLinksContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardListContainer")).toBeInTheDocument();
  });

  it("should render the dashboard with all components (recruiter role)", () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "Jay", oid: "", role: Roles.RECRUITER});
    render(
      <Dashboard
        totalApplicants={100}
        setTotalApplicants={mockSetTotalApplicants}
        totalWillExpire={25}
        setTotalWillExpire={mockSetTotalWillExpire}
        totalExpired={10}
        setTotalExpired={mockSetTotalExpired}
        currentUser={"Jay"}
      />
    );

    expect(screen.getByText("Welcome Jay")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the Applicants page."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Mocked DashboardStatisticsContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardQuickLinksContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardListContainer")).toBeInTheDocument();
  });

  it("should render the dashboard with all components (interviewer role)", () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "Jay", oid: "", role: Roles.INTERVIEWER});
    render(
      <Dashboard
        totalApplicants={100}
        setTotalApplicants={mockSetTotalApplicants}
        totalWillExpire={25}
        setTotalWillExpire={mockSetTotalWillExpire}
        totalExpired={10}
        setTotalExpired={mockSetTotalExpired}
        currentUser={"Jay"}
      />
    );

    expect(screen.getByText("Welcome Jay")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the Applicants page."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Mocked DashboardStatisticsContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardQuickLinksContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardListContainer")).toBeInTheDocument();
  });
});
