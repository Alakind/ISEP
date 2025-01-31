import PageNotFound from "../../src/containers/PageNotFound.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {vi} from "vitest";
import {ReactNode} from "react";
import {useIsAuthenticated} from "@azure/msal-react";

vi.mock("@azure/msal-react", () => ({
  AuthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  UnauthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  useMsal: vi.fn(() => ({
    instance: {
      getActiveAccount: vi.fn(() => ({username: "testuser@gmail.com"})),
    },
  })),
  useIsAuthenticated: vi.fn(() => true)
}));

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

  it("contains a link to the logout if the user is authenticated", () => {
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {name: /logout/i});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("doesn't render the header when user is not authenticated", () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(false);
    render(
      <MemoryRouter>
        <PageNotFound/>
      </MemoryRouter>
    );

    // It should only render one such a link instead of two
    const links = screen.getAllByRole("link", {name: /dashboard/i});
    expect(links[0]).toBeInTheDocument();
    expect(links).toHaveLength(1)
  });

  it("contains the header container", () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true);
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