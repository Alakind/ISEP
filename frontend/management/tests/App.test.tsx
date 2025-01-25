import {render, screen} from "@testing-library/react";
import App from "../src/App.tsx";
import {expect, vi} from "vitest";
import {BrowserRouter as Router, MemoryRouter, useNavigate} from "react-router-dom";
import {ReactNode} from "react";
import {useMsal} from "@azure/msal-react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(() => ({pathname: "/"})),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock("@azure/msal-react", () => ({
  AuthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  UnauthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  useMsal: vi.fn(() => ({
    instance: {
      getActiveAccount: vi.fn(() => ({username: "testuser@gmail.com"})),
    },
  })),
}));

vi.mock("../src/utils/msal/MsUserProvider.tsx", () => ({
  MsUserProvider: ({children}: { children: ReactNode }) => <>{children}</>
}))

vi.mock("../src/utils/msal/UserProvider.tsx", () => ({
  UserProvider: ({children}: { children: ReactNode }) => <>{children}</>
}))

vi.mock("../src/containers/header/HeaderContainer.tsx", () => ({
  default: () => <div>HeaderContainer</div>,
}));

vi.mock("../src/containers/auth/LoginPageContainer.tsx", () => ({
  default: () => <div>LoginPageContainer</div>,
}));

describe('App Component', () => {
  it('renders the HeaderContainer when the user is active with the authenticated template', () => {
    render(
      <Router>
        <App/>
      </Router>
    );

    expect(screen.getByText("HeaderContainer")).toBeInTheDocument();
  });

  it('renders LoginPageContainer when the user is not active with the unauthenticated template', () => {
    vi.mocked(useMsal).mockReturnValueOnce({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      instance: {
        getActiveAccount: vi.fn(() => null),
      }
    });
    render(
      <Router>
        <App/>
      </Router>
    );

    expect(screen.getByText("LoginPageContainer")).toBeInTheDocument();
  });

  it("redirects to /dashboard when pathname is /", () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App/>
      </MemoryRouter>
    );

    expect(navigateMock).toHaveBeenCalledWith("/dashboard", {replace: true});
  });
});