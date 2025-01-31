import {render, screen, waitFor} from "@testing-library/react";
import {MsUserProvider} from "../../../src/utils/msal/MsUserProvider";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";
import {useMsUserData} from "../../../src/utils/msal/UseMsUserData.tsx";
import {vi} from "vitest";
import {ReactNode} from "react";

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

describe("useMsUserData", () => {

  it("provides context values within MsUserProvider", async () => {
    const TestComponent = () => {
      const msUser = useMsUserData();
      return (
        <div>
          <p data-testid="givenName">{msUser.givenName}</p>
          <p data-testid="surname">{msUser.surname}</p>
          <p data-testid="mail">{msUser.mail}</p>
          <p data-testid="oid">{msUser.oid}</p>
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
        <TestComponent/>
      </MsUserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("givenName")).toHaveTextContent("Jane");
      expect(screen.getByTestId("surname")).toHaveTextContent("Doe");
      expect(screen.getByTestId("mail")).toHaveTextContent("jane.doe@example.com");
      expect(screen.getByTestId("oid")).toHaveTextContent("9876-5432-1098");
    });
  });
});