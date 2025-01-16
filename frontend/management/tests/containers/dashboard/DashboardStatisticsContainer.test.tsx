import {render, screen} from "@testing-library/react";
import DashboardStatisticsContainer from "../../../src/containers/dashboard/DashboardStatisticsContainer.tsx";

vi.mock("../../../src/components/dashboard/DashboardStatistics.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked DashboardStatistics</div>),
  };
});

describe("DashboardStatisticsContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the DashboardStatistics component", () => {
    render(<DashboardStatisticsContainer totalApplicants={0} totalWillExpire={0} totalExpired={0}/>);

    expect(screen.getByText("Mocked DashboardStatistics")).toBeInTheDocument();
  });
});
