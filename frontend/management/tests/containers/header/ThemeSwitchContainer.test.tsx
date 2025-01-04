vi.mock("../../../src/components/header/ThemeSwitch.tsx", () => ({
  __esModule: true,
  default: ({switchTheme, theme}: { switchTheme: () => void; theme: string }) => (
    <button data-testid="theme-switch" onClick={switchTheme}>
      Current Theme: {theme}
    </button>
  ),
}));

import {fireEvent, render, screen} from "@testing-library/react";
import ThemeSwitchContainer from "../../../src/containers/header/ThemeSwitchContainer.tsx";
import {Themes} from "../../../src/utils/constants.tsx";


describe("ThemeSwitchContainer", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.setAttribute("data-theme", "");
  });

  it("initializes with the DARK theme if no theme is stored in localStorage", () => {
    render(<ThemeSwitchContainer/>);

    expect(localStorage.getItem("Theme")).toBe("DARK");
    expect(document.body.getAttribute("data-theme")).toBe(Themes.DARK);
    expect(screen.getByTestId("theme-switch")).toHaveTextContent("Current Theme: dark");
  });

  it("initializes with the LIGHT theme if LIGHT is stored in localStorage", () => {
    localStorage.setItem("Theme", "LIGHT");
    render(<ThemeSwitchContainer/>);

    expect(localStorage.getItem("Theme")).toBe("LIGHT");
    expect(document.body.getAttribute("data-theme")).toBe(Themes.LIGHT);
    expect(screen.getByTestId("theme-switch")).toHaveTextContent("Current Theme: light");
  });

  it("toggles the theme when the switch is clicked", () => {
    render(<ThemeSwitchContainer/>);

    const switchButton = screen.getByTestId("theme-switch");
    expect(localStorage.getItem("Theme")).toBe("DARK");

    fireEvent.click(switchButton);

    expect(localStorage.getItem("Theme")).toBe("LIGHT");
    expect(document.body.getAttribute("data-theme")).toBe(Themes.LIGHT);
    expect(screen.getByTestId("theme-switch")).toHaveTextContent("Current Theme: light");

    fireEvent.click(switchButton);

    expect(localStorage.getItem("Theme")).toBe("DARK");
    expect(document.body.getAttribute("data-theme")).toBe(Themes.DARK);
    expect(screen.getByTestId("theme-switch")).toHaveTextContent("Current Theme: dark");
  });
});