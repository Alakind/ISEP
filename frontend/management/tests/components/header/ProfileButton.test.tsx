import ProfileButton from "../../../src/components/header/ProfileButton.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

const mockHandleLogout = vi.fn()

describe('ProfileButton component', () => {
  it('renders the current users name', () => {
    render(<MemoryRouter><ProfileButton currentUser="John Doe" currentRole={""} handleLogout={mockHandleLogout}/></MemoryRouter>);

    const userName = screen.getByText(/john doe/i);
    expect(userName).toBeInTheDocument();
  });

  it('renders the profile button icon', () => {
    render(<MemoryRouter><ProfileButton currentUser="John Doe" currentRole={""} handleLogout={mockHandleLogout}/></MemoryRouter>);

    const button = screen.getByRole('button');
    expect(button.firstChild).toHaveClass('bi bi-person-circle');
  });

  it('renders the correct dropdown menu links', () => {
    render(<MemoryRouter><ProfileButton currentUser="John Doe" currentRole={""} handleLogout={mockHandleLogout}/></MemoryRouter>);


    const logoutLink = screen.getByText(/logout/i);
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute('href', '/logout');
  });

  it('renders the dropdown menu divider', () => {
    render(<MemoryRouter><ProfileButton currentUser="John Doe" currentRole={""} handleLogout={mockHandleLogout}/></MemoryRouter>);

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });
})