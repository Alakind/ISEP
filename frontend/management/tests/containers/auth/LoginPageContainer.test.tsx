import {fireEvent, render, screen} from "@testing-library/react";
import {useMsal} from "@azure/msal-react";
import LoginPageContainer from "../../../src/containers/auth/LoginPageContainer.tsx";
import {ReactNode} from "react";

vi.mock("@azure/msal-react", () => ({
  AuthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  UnauthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  useMsal: vi.fn(() => ({
    instance: {
      getActiveAccount: vi.fn(() => ({username: "testuser@gmail.com"})),
      loginRedirect: vi.fn(() => Promise.resolve())
    },
  })),
}));

vi.mock("../../../src/components/auth/LoginPage.tsx", () => ({
  default: ({handleRedirect}: { handleRedirect: () => void }) => (
    <button onClick={handleRedirect} data-testid="login-button">
      Login
    </button>
  ),
}));

describe("LoginPageContainer", () => {
  it("renders the login button and calls loginRedirect on click", () => {
    const mockLoginRedirect = vi.fn(() => Promise.resolve());
    const mockInstance = {loginRedirect: mockLoginRedirect};

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    vi.mocked(useMsal).mockReturnValue({instance: mockInstance});

    render(<LoginPageContainer/>);

    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(mockLoginRedirect).toHaveBeenCalledWith(
      expect.objectContaining({prompt: "create"})
    );
  });

  it("handles loginRedirect errors", async () => {
    const mockLoginRedirect = vi.fn(() => Promise.reject(new Error("Test error")));
    const mockInstance = {loginRedirect: mockLoginRedirect};

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    vi.mocked(useMsal).mockReturnValue({instance: mockInstance});

    render(<LoginPageContainer/>);

    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockLoginRedirect).toHaveBeenCalled();
  });
});