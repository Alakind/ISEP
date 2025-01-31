import {render, screen} from "@testing-library/react";
import DashboardStatistics from "../../../src/components/dashboard/DashboardStatistics.tsx";

describe("DashboardStatistics", () => {
  it("should render statistics with correct data", () => {
    const mockProps = {
      totalApplicants: 100,
      totalWillExpire: 25,
      totalExpired: 15,
    };

    render(
      <DashboardStatistics
        totalApplicants={mockProps.totalApplicants}
        totalWillExpire={mockProps.totalWillExpire}
        totalExpired={mockProps.totalExpired}
      />
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Total Applicants")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Will expire in 2 days")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Have Expired")).toBeInTheDocument();
  });

  it("should handle undefined data gracefully", () => {
    render(
      <DashboardStatistics
        totalApplicants={undefined}
        totalWillExpire={undefined}
        totalExpired={undefined}
      />
    );

    expect(screen.getAllByRole("heading", {name: "0"})[0]).toBeInTheDocument();
    expect(screen.getByText("Total Applicants")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", {name: "0"})[1]).toBeInTheDocument();
    expect(screen.getByText("Will expire in 2 days")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", {name: "0"})[2]).toBeInTheDocument();
    expect(screen.getByText("Have Expired")).toBeInTheDocument();
  });
});

