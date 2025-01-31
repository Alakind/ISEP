import {render, screen} from "@testing-library/react";
import {useMsUserData} from "../../../src/utils/msal/UseMsUserData.tsx";
import {vi} from "vitest";
import {ReactNode} from "react";

vi.mock("@azure/msal-react", () => ({
  AuthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  UnauthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  useMsal: vi.fn(() => ({
    instance: {
      getActiveAccount: vi.fn(() => ({username: "testuser@gmail.com"})),
      logoutRedirect: vi.fn()
    },
  })),
}));

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useState: vi.fn(),
  useContext: vi.fn(() => undefined),
  createContext: vi.fn(),
}))


describe("useMsUserData", () => {
  it("throws an error when used outside MsUserProvider", () => { //path can never be taken
    const TestComponent = () => {
      try {
        useMsUserData();
      } catch (error: unknown) {
        return <div data-testid="error">{(error as Error).message}</div>;
      }
      return null;
    };

    render(<TestComponent/>);

    expect(screen.getByTestId("error")).toHaveTextContent(
      "useMsUserData must be used within a MsUserProvider"
    );
  });
});