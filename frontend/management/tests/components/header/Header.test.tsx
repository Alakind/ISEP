import Header from "../../../src/components/header/Header.tsx";
import {render, screen} from "@testing-library/react";
import {toast} from "react-toastify";
import {act} from "react";

describe('Header component', () => {
  const urlPrefix = 'http://localhost:8081/management';

  it('renders the navbar brand correctly', () => {
    render(<Header currentPage="applicants" urlPrefix={urlPrefix}/>);

    const brand = screen.getByRole('link', {name: /asserberus/i});
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', `${urlPrefix}/`);
  });

  it('renders the navigation links with correct active state', () => {
    render(<Header currentPage="assessments" urlPrefix={urlPrefix}/>);

    const applicantsLink = screen.getByRole('link', {name: /applicants/i});
    const assessmentsLink = screen.getByRole('link', {name: /assessments/i});
    const usersLink = screen.getByRole('link', {name: /users/i});

    expect(applicantsLink).not.toHaveClass('active');
    expect(assessmentsLink).toHaveClass('active');
    expect(usersLink).not.toHaveClass('active');
  });

  it('renders the ProfileButtonContainer', () => {
    render(<Header currentPage="users" urlPrefix={urlPrefix}/>);

    const profileButton = screen.getByTestId('profile-button');
    expect(profileButton).toBeInTheDocument();
  });

  it('renders the ThemeSwitchContainer', () => {
    render(<Header currentPage="users" urlPrefix={urlPrefix}/>);

    const themeSwitch = screen.getByTestId('theme-switch');
    expect(themeSwitch).toBeInTheDocument();
  });

  it('renders the ToastContainer with an active toast', () => {
    render(<Header currentPage="users" urlPrefix={urlPrefix}/>);
    act(() => toast.success("This is a toast"))

    const toastContainer = screen.getByTestId('toast-container');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer.children.item(0)).toHaveClass("Toastify");
    expect(toastContainer).toHaveTextContent("This is a toast");
  });
})