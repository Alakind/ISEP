import {render, screen} from "@testing-library/react";
import {ReactNode, useContext} from "react";
import {MsUserContext} from "../../../src/utils/msal/MsUserContext.tsx";

vi.mock("../../context/MsUserContext", () => {
  return {
    MsUserContext: {
      Provider: ({children}: { children: ReactNode }) => <div>{children}</div>,
    },
  };
});

describe("MsUserContext", () => {
  it("provides default values", () => {
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
      <MsUserContext.Provider value={{givenName: "John", surname: "Doe", mail: "john.doe@example.com", oid: "1234-5678-9012"}}>
        <TestComponent/>
      </MsUserContext.Provider>
    );

    expect(screen.getByTestId("givenName")).toHaveTextContent("John");
    expect(screen.getByTestId("surname")).toHaveTextContent("Doe");
    expect(screen.getByTestId("mail")).toHaveTextContent("john.doe@example.com");
    expect(screen.getByTestId("oid")).toHaveTextContent("1234-5678-9012");
  });
});