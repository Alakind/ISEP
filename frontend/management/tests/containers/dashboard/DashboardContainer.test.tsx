import {render, screen} from "@testing-library/react";
import Dashboard from "../../../src/components/dashboard/Dashboard.tsx";
import DashboardContainer from "../../../src/containers/dashboard/DashboardContainer.tsx";

vi.mock("../../../src/components/dashboard/Dashboard.tsx", () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div>Mocked Dashboard</div>),
  };
});

describe("DashboardContainer", () => {
  it("should render the Dashboard component with correct initial props", () => {
    render(<DashboardContainer/>);
    
    expect(screen.getByText("Mocked Dashboard")).toBeInTheDocument();

    expect(Dashboard).toHaveBeenCalledWith(
      {
        totalApplicants: 0,
        setTotalApplicants: expect.any(Function),
        totalWillExpire: 0,
        setTotalWillExpire: expect.any(Function),
        totalExpired: 0,
        setTotalExpired: expect.any(Function),
      },
      {}
    );
  });
});