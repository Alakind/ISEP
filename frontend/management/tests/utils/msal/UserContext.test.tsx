import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {useContext} from "react";
import {UserContext} from "../../../src/utils/msal/UserContext.tsx";

describe("UserContext", () => {
  it("provides default values", () => {
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
      <UserContext.Provider value={{name: "", email: "", role: "", id: "", oid: ""}}>
        <TestComponent/>
      </UserContext.Provider>
    );

    expect(screen.getByTestId("name")).toHaveTextContent("");
    expect(screen.getByTestId("email")).toHaveTextContent("");
    expect(screen.getByTestId("role")).toHaveTextContent("");
    expect(screen.getByTestId("id")).toHaveTextContent("");
    expect(screen.getByTestId("oid")).toHaveTextContent("");
  });

  it("allows overriding context values", () => {
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
      <UserContext.Provider
        value={{
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
          id: "12345",
          oid: "67890",
        }}
      >
        <TestComponent/>
      </UserContext.Provider>
    );

    expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("email")).toHaveTextContent("john.doe@example.com");
    expect(screen.getByTestId("role")).toHaveTextContent("Admin");
    expect(screen.getByTestId("id")).toHaveTextContent("12345");
    expect(screen.getByTestId("oid")).toHaveTextContent("67890");
  });
});
