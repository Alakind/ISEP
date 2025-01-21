import Header from "../../../src/components/header/Header.tsx";
import {render, screen} from "@testing-library/react";
import {toast} from "react-toastify";
import {act} from "react";
import {MemoryRouter} from "react-router-dom";

describe('Header component', () => {

  it('renders the navbar brand correctly', () => {
    render(<MemoryRouter><Header currentPage="applicants"/></MemoryRouter>);

    const brand = screen.getByRole('link', {name: /asserberus/i});
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', `/dashboard`);
  });

  it('renders the navigation links with correct active state', () => {
    render(<MemoryRouter><Header currentPage="assessments"/></MemoryRouter>);

    const applicantsLink = screen.getByRole('link', {name: /applicants/i});
    const assessmentsLink = screen.getByRole('link', {name: /assessments/i});
    const usersLink = screen.getByRole('link', {name: /users/i});

    expect(applicantsLink).not.toHaveClass('active');
    expect(assessmentsLink).toHaveClass('active');
    expect(usersLink).not.toHaveClass('active');
  });

  it('renders the ProfileButtonContainer', () => {
    render(<MemoryRouter><Header currentPage="users"/></MemoryRouter>);

    const profileButton = screen.getByTestId('profile-button');
    expect(profileButton).toBeInTheDocument();
  });

  it('renders the ThemeSwitchContainer', () => {
    render(<MemoryRouter><Header currentPage="users"/></MemoryRouter>);

    const themeSwitch = screen.getByTestId('theme-switch');
    expect(themeSwitch).toBeInTheDocument();
  });

  it('renders the ToastContainer with an active toast', () => {
    render(<MemoryRouter><Header currentPage="users"/></MemoryRouter>);
    act(() => toast.success("This is a toast"))

    const toastContainer = screen.getByTestId('toast-container');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer.children.item(0)).toHaveClass("Toastify");
    expect(toastContainer).toHaveTextContent("This is a toast");
  });
})