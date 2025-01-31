import {render, screen} from "@testing-library/react";
import {vi} from "vitest";
import {ReactNode} from "react";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";

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
  useContext: vi.fn(() => undefined),
  createContext: vi.fn(),
}))

describe("useUserData", () => {
  it("throws an error when used outside UserProvider", () => { //path can never be taken
    const TestComponent = () => {
      try {
        useUserData();
      } catch (error) {
        if (error instanceof Error) {
          return <div data-testid="error">{(error as Error).message}</div>;
        }
      }
      return null;
    };

    render(<TestComponent/>);

    expect(screen.queryByTestId("error")).toHaveTextContent(
      "useUserData must be used within a UserProvider"
    );
  });
});