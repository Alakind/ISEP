import {fireEvent, render, screen} from "@testing-library/react";
import LoginPage from "../../../src/components/auth/LoginPage.tsx";

vi.mock("../../../src/components/Button.tsx", () => ({
  default: ({handleClick, text}: { handleClick: () => void; text: string }) => (
    <button onClick={handleClick} data-testid="login-button">
      {text}
    </button>
  ),
}));

vi.mock("../../../src/components/InfoSupportLogo.tsx", () => ({
  default: () => <div data-testid="logo">InfoSupport Logo</div>,
}));

describe("LoginPage", () => {
  it("renders the login page with all elements", () => {
    const mockHandleRedirect = vi.fn();

    render(<LoginPage handleRedirect={mockHandleRedirect}/>);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("InfoSupport")).toBeInTheDocument();
    expect(screen.getByText("Asserberus")).toBeInTheDocument();
    expect(screen.getByText(/A pre job interview assessment application/)).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("calls handleRedirect when the login button is clicked", () => {
    const mockHandleRedirect = vi.fn();

    render(<LoginPage handleRedirect={mockHandleRedirect}/>);

    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);

    expect(mockHandleRedirect).toHaveBeenCalled();
  });
});
