import ProfileButton from "../../../src/components/header/ProfileButton.tsx";
import {render, screen} from "@testing-library/react";

describe('ProfileButton component', () => {
  it('renders the current users name', () => {
    render(<ProfileButton urlPrefix="/app" currentUser="John Doe"/>);

    const userName = screen.getByText(/john doe/i);
    expect(userName).toBeInTheDocument();
  });

  it('renders the profile button icon', () => {
    render(<ProfileButton urlPrefix="/app" currentUser="John Doe"/>);

    const button = screen.getByRole('button');
    expect(button.firstChild).toHaveClass('bi bi-person-circle');
  });

  it('renders the correct dropdown menu links', () => {
    render(<ProfileButton urlPrefix="/app" currentUser="John Doe"/>);

    const profileLink = screen.getByText(/my profile/i);
    const settingsLink = screen.getByText(/settings/i);
    const logoutLink = screen.getByText(/logout/i);

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/app/profile');
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/app/settings');
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute('href', '/app/logout');
  });

  it('renders the dropdown menu divider', () => {
    render(<ProfileButton urlPrefix="/app" currentUser="John Doe"/>);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });
})