import {render, screen, waitFor} from "@testing-library/react";
import {vi} from "vitest";
import {ReactNode} from "react";
import {UserProvider} from "../../../src/utils/msal/UserProvider.tsx";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";
import {MsUserProvider} from "../../../src/utils/msal/MsUserProvider.tsx";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({
    given_name: "Jane",
    family_name: "Doe",
    unique_name: "jane.doe@example.com",
    oid: "9876-5432-1098",
  })),
}));

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

  it("provides context values within UserProvider", async () => {
    const TestComponent = () => {
      const {name, email, role, id, oid} = useUserData();
      return (
        <div>
          <p data-testid="name">{name}</p>
          <p data-testid="email">{email}</p>
          <p data-testid="role">{role}</p>
          <p data-testid="id">{id}</p>
          <p data-testid="oid">{oid}</p>
        </div>
      );
    };
    const mockInstance = {
      acquireTokenSilent: vi.fn(() =>
        Promise.resolve({accessToken: "mockAccessToken"})
      ),
    } as unknown as IPublicClientApplication;

    const mockActiveAccount = {
      homeAccountId: "mockHomeAccountId",
      environment: "mockEnvironment",
      tenantId: "mockTenantId",
      username: "mockUsername",
    } as AccountInfo;

    render(
      <MsUserProvider instance={mockInstance} activeAccount={mockActiveAccount}>
        <UserProvider>
          <TestComponent/>
        </UserProvider>

      </MsUserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("Jay");
      expect(screen.getByTestId("id")).toHaveTextContent("123")
      expect(screen.getByTestId("role")).toHaveTextContent("")
      expect(screen.getByTestId("email")).toHaveTextContent("jay@gmail.com");
      expect(screen.getByTestId("oid")).toHaveTextContent("9876-5432-1098");
    });
  });
});