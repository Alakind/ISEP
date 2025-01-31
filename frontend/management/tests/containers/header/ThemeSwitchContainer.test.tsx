vi.mock("../../../src/components/header/ThemeSwitch.tsx", () => ({
  __esModule: true,
  default: ({switchTheme, theme}: { switchTheme: () => void; theme: string }) => (
    <button data-testid="theme-switch" onClick={switchTheme}>
      Current Theme: {theme}
    </button>
  ),
}));

import {render, screen} from "@testing-library/react";
import ThemeSwitchContainer from "../../../src/containers/header/ThemeSwitchContainer.tsx";

describe("ThemeSwitchContainer", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.setAttribute("data-theme", "");
  });

  it("renders the theme switch container", () => {
    render(<ThemeSwitchContainer/>);

    expect(localStorage.getItem("Theme")).not.toBe("DARK");
    expect(document.body.getAttribute("data-theme")).toBe("");
    expect(screen.getByTestId("theme-switch")).toHaveTextContent("Current Theme: dark");
  });
});