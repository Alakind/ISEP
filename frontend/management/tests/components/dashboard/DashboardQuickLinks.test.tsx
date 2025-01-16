import {render, screen} from "@testing-library/react";
import DashboardQuickLinks from "../../../src/components/dashboard/DashboardQuickLinks.tsx";

describe("DashboardQuickLinks", () => {
  it("should render the quick links with correct content", () => {
    render(<DashboardQuickLinks/>);

    expect(screen.getByText("Quick Links:")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveTextContent("Main Git Repository");
    expect(links[0]).toHaveAttribute("href", "https://github.com/Alakind/ISEP");

    expect(links[1]).toHaveTextContent("Question Git Repository");
    expect(links[1]).toHaveAttribute("href", "https://github.com/eefscheef/ISEP-questions");

    expect(links[2]).toHaveTextContent("User Manual");
    expect(links[2]).toHaveAttribute("href", "#"); //TODO should be changed to actual link
  });
});