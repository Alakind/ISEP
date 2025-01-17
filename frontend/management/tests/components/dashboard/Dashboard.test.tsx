import {render, screen} from "@testing-library/react";
import Dashboard from "../../../src/components/dashboard/Dashboard.tsx";

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

describe("Dashboard", () => {
  const mockSetTotalApplicants = vi.fn();
  const mockSetTotalWillExpire = vi.fn();
  const mockSetTotalExpired = vi.fn();

  it("should render the dashboard with all components", () => {
    render(
      <Dashboard
        totalApplicants={100}
        setTotalApplicants={mockSetTotalApplicants}
        totalWillExpire={25}
        setTotalWillExpire={mockSetTotalWillExpire}
        totalExpired={10}
        setTotalExpired={mockSetTotalExpired}
      />
    );

    expect(screen.getByText("Welcome Jurre")).toBeInTheDocument();


    expect(
      screen.getByText(
        "Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the Applicants page. To view the roles of users navigate to the Users page."
      )
    ).toBeInTheDocument();


    expect(screen.getByText("Mocked DashboardStatisticsContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardQuickLinksContainer")).toBeInTheDocument();
    expect(screen.getByText("Mocked DashboardListContainer")).toBeInTheDocument();
  });
});
