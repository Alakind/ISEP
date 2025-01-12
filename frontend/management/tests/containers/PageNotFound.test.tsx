import PageNotFound from "../../src/containers/PageNotFound.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

describe("PageNotFound Component", () => {
  it("renders the 404 message", () => {
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    // Check for the 404 header
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders the error description", () => {
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    // Check for the description
    expect(
      screen.getByText(
        "Sorry, the page you are looking for does not exist.",
        {exact: false}
      )
    ).toBeInTheDocument();
  });

  it("contains a link to the applicants dashboard", () => {
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    // Check for the link to applicants
    const link = screen.getByRole("link", {name: /applicants dashboard/i});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/applicants");
  });

  it("contains the header container", () => {
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    // Check for the header
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("header");
  });
});