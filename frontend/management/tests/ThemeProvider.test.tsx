import {fireEvent, render, screen} from "@testing-library/react";
import {ThemeProvider, useTheme} from "../src/ThemeContext.tsx";
import {Themes} from "../src/utils/constants.tsx";
import {act} from "react";

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(),
    setItem: vi.fn(),
  });
});

describe("ThemeProvider", () => {
  it("should initialize with DARK theme by default", () => {
    const TestComponent = () => {
      const {theme} = useTheme();
      return <div>{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent/>
      </ThemeProvider>
    );

    expect(screen.getByText(Themes.DARK)).toBeTruthy();
  });

  it("should initialize with LIGHT theme if stored in localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(Themes.LIGHT);

    const TestComponent = () => {
      const {theme} = useTheme();
      return <div>{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent/>
      </ThemeProvider>
    );

    expect(screen.getByText(Themes.LIGHT)).toBeTruthy();
  });

  it("should toggle theme between DARK and LIGHT", () => {
    const TestComponent = () => {
      const {theme, toggleTheme} = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent/>
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId("theme");
    const toggleButton = screen.getByText("Toggle");

    expect(themeElement.textContent).toBe(Themes.DARK);

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(themeElement.textContent).toBe(Themes.LIGHT);

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(themeElement.textContent).toBe(Themes.DARK);
  });

  it("should store the theme in localStorage on change", () => {
    const TestComponent = () => {
      const {toggleTheme} = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <ThemeProvider>
        <TestComponent/>
      </ThemeProvider>
    );

    const toggleButton = screen.getByText("Toggle");

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(localStorage.setItem).toHaveBeenCalledWith("Theme", Themes.LIGHT);

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(localStorage.setItem).toHaveBeenCalledWith("Theme", Themes.DARK);
  });

  it("should set the data-theme attribute on the body element", () => {
    const TestComponent = () => {
      const {toggleTheme} = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <ThemeProvider>
        <TestComponent/>
      </ThemeProvider>
    );

    const toggleButton = screen.getByText("Toggle");

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(document.body.getAttribute("data-theme")).toBe(Themes.LIGHT);

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(document.body.getAttribute("data-theme")).toBe(Themes.DARK);
  });
});
