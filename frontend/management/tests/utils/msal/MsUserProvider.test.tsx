import {render, screen, waitFor} from "@testing-library/react";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";
import {useContext} from "react";
import {MsUserContext} from "../../../src/utils/msal/MsUserContext.tsx";
import {MsUserProvider} from "../../../src/utils/msal/MsUserProvider.tsx";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({
    given_name: "Jane",
    family_name: "Doe",
    unique_name: "jane.doe@example.com",
    oid: "9876-5432-1098",
  })),
}));

describe("MsUserProvider", () => {
  const mockInstance = {
    acquireTokenSilent: vi.fn(() =>
      Promise.resolve({accessToken: "mockAccessToken"})
    ),
    logoutRedirect: vi.fn(() => Promise.resolve()),
  } as unknown as IPublicClientApplication;

  const mockActiveAccount = {
    homeAccountId: "mockHomeAccountId",
    environment: "mockEnvironment",
    tenantId: "mockTenantId",
    username: "mockUsername",
  } as AccountInfo;

  it("provides user data after acquiring a token", async () => {
    const TestComponent = () => {
      const context = useContext(MsUserContext);
      return (
        <div>
          <p data-testid="givenName">{context.givenName}</p>
          <p data-testid="surname">{context.surname}</p>
          <p data-testid="mail">{context.mail}</p>
          <p data-testid="oid">{context.oid}</p>
        </div>
      );
    };

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

  it("logs out when token acquisition fails", async () => {
    mockInstance.acquireTokenSilent = vi.fn(() => Promise.reject(new Error("Token error")));

    render(
      <MsUserProvider instance={mockInstance} activeAccount={mockActiveAccount}>
        <div>Test</div>
      </MsUserProvider>
    );

    await waitFor(() => {
      expect(mockInstance.logoutRedirect).toHaveBeenCalledWith(
        expect.objectContaining({postLogoutRedirectUri: "/"})
      );
    });
  });
});
