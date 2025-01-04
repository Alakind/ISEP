import ThemeSwitch from "../../../src/components/header/ThemeSwitch.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import {Themes} from "../../../src/utils/constants.tsx";

describe('ThemeSwitch component', () => {
  it('renders the sun icon when the theme is dark', () => {
    render(<ThemeSwitch switchTheme={() => {
    }} theme={Themes.DARK}/>);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button.firstChild).toHaveClass('bi bi-sun');
  });

  it('renders the moon icon when the theme is light', () => {
    render(<ThemeSwitch switchTheme={() => {
    }} theme={Themes.LIGHT}/>);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button.firstChild).toHaveClass('bi bi-moon');
  });

  it('calls switchTheme when the button is clicked', () => {
    const mockSwitchTheme = vi.fn();
    render(<ThemeSwitch switchTheme={mockSwitchTheme} theme={Themes.DARK}/>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSwitchTheme).toHaveBeenCalled();
  });
})