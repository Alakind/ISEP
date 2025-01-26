import {render, screen, waitFor} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {useContext} from "react";
import {toast} from "react-toastify";
import {Roles} from "../../../src/utils/constants.tsx";
import {UserContext} from "../../../src/utils/msal/UserContext.tsx";
import {UserProvider} from "../../../src/utils/msal/UserProvider.tsx";
import {addUser, getUserOid} from "../../../src/utils/apiFunctions.tsx";

vi.mock("../../../src/utils/apiFunctions.tsx", () => ({
  addUser: vi.fn(() => Promise.resolve()),
  getUserOid: vi.fn(() =>
    Promise.resolve({
      id: "12345",
      name: "John Doe",
      email: "john.doe@example.com",
      role: Roles.ADMIN,
      oid: "67890",
    })
  ),
  updateUser: vi.fn(() => Promise.resolve()),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@azure/msal-react", () => ({
  useMsal: vi.fn(() => ({
    instance: {
      logoutRedirect: vi.fn(() => Promise.resolve()),
    },
  })),
}));

vi.mock("../../../src/utils/msal/UseMsUserData.tsx", () => ({
  useMsUserData: vi.fn(() => ({
    givenName: "Jane",
    surname: "Doe",
    mail: "jane.doe@example.com",
    oid: "67890",
  })),
}));

describe("UserProvider", () => {
  it("provides user data after retrieving user oid", async () => {
    const TestComponent = () => {
      const context = useContext(UserContext);
      return (
        <div>
          <p data-testid="name">{context.name}</p>
          <p data-testid="email">{context.email}</p>
          <p data-testid="role">{context.role}</p>
          <p data-testid="id">{context.id}</p>
          <p data-testid="oid">{context.oid}</p>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent/>
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("email")).toHaveTextContent("john.doe@example.com");
      expect(screen.getByTestId("role")).toHaveTextContent(Roles.ADMIN);
      expect(screen.getByTestId("id")).toHaveTextContent("12345");
      expect(screen.getByTestId("oid")).toHaveTextContent("67890");
    });
  });

  it("adds a new user if user oid is not found", async () => {
    vi.mocked(getUserOid).mockRejectedValueOnce(new Error("Failed to retrieve user with oid"));

    render(
      <UserProvider>
        <div>Test</div>
      </UserProvider>
    );

    await waitFor(() => {
      expect(addUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          oid: "67890",
        })
      );
      expect(toast.success).toHaveBeenCalledWith("New user has been added");
    });
  });
});
