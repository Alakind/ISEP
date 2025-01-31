import {render, screen, waitFor} from "@testing-library/react";
import {vi} from "vitest";
import {UserProvider} from "../../../src/utils/msal/UserProvider.tsx";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";
import {MsUserProvider} from "../../../src/utils/msal/MsUserProvider.tsx";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";
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

vi.mock("../../../src/utils/msal/UseMsUserData.tsx", () => ({
  useMsUserData: vi.fn().mockReturnValue({
    given_name: "Jane",
    family_name: "Doe",
    unique_name: "jane.doe@example.com",
    oid: "9876-5432-1098",
  })
}))

vi.mock('../../../src/utils/apiFunctions.tsx', () => ({
  __esModule: true,
  getUserOid: vi.fn(() => Promise.resolve({
    id: "123",
    name: "Jay",
    email: "jay@gmail.com",
    role: null,
    createdAt: "2024-10-10 10:23:45",
    oid: "9876-5432-1098",
  })),
  updateUser: vi.fn(),
  addUser: vi.fn(),
}));


vi.mock("../../../src/utils/general.tsx", () => ({
  capitalizeFirstLetter: vi.fn(() => ("Jay"))
}))

describe("useUserData", () => {
  it("provides context values within UserProvider", async () => {
    const TestComponent = () => {
      const user = useUserData();
      console.log(user)
      return (
        <div>
          <p data-testid="name">{user.name}</p>
          <p data-testid="email">{user.email}</p>
          <p data-testid="role">{user.role}</p>
          <p data-testid="id">{user.id}</p>
          <p data-testid="oid">{user.oid}</p>
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
      expect(screen.getByTestId("role")).toHaveTextContent("-")
      expect(screen.getByTestId("email")).toHaveTextContent("jay@gmail.com");
      expect(screen.getByTestId("oid")).toHaveTextContent("9876-5432-1098");
    });
  });
});