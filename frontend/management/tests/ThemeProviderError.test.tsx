import {render} from "@testing-library/react";
import {useTheme} from "../src/ThemeContext.tsx";
import {beforeEach, describe, vi} from "vitest";

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(),
    setItem: vi.fn(),
  });
  vi.mock("react", () => ({
    ...vi.importActual("react"),
    useState: vi.fn(),
    useContext: vi.fn(() => undefined),
    createContext: vi.fn(),
  }))
});

describe("ThemeProvider", () => {
  it("should throw an error when the useTheme is not used within a theme provider", () => {

    const TestComponent = () => {
      const {toggleTheme} = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    expect(() => render(<TestComponent/>)).toThrowError(
      "useTheme must be used within a ThemeProvider"
    );

  })
});
