import Header from "../../../src/components/header/Header.tsx";
import {render, screen} from "@testing-library/react";
import {toast} from "react-toastify";
import {act} from "react";
import {MemoryRouter} from "react-router-dom";
import {Roles} from "../../../src/utils/constants.tsx";
import {useUserData} from "../../../src/utils/msal/UseUserData.tsx";

vi.mock("../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN}))
}))

describe('Header component', () => {
  it('renders the navbar brand correctly', () => {
    render(<MemoryRouter><Header currentPage="applicants"/></MemoryRouter>);

    const brand = screen.getByRole('link', {name: /asserberus/i});
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', `/dashboard`);
  });

  it('renders the navigation links with correct active state (role: ADMIN)', () => {
    render(<MemoryRouter><Header currentPage="dashboard"/></MemoryRouter>);

    const dashboardLink = screen.getByRole('link', {name: /dashboard/i});
    const applicantsLink = screen.getByRole('link', {name: /applicants/i});
    const usersLink = screen.getByRole('link', {name: /users/i});

    expect(dashboardLink).toHaveClass('active');
    expect(applicantsLink).not.toHaveClass('active');
    expect(usersLink).not.toHaveClass('active');
  });

  it('renders the navigation links for the Admin role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.ADMIN})
    render(<MemoryRouter><Header currentPage="dashboard"/></MemoryRouter>);

    const dashboardLink = screen.queryByRole('link', {name: /dashboard/i});
    const applicantsLink = screen.queryByRole('link', {name: /applicants/i});
    const usersLink = screen.queryByRole('link', {name: /users/i});

    expect(dashboardLink).toBeInTheDocument();
    expect(applicantsLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();
  });

  it('renders the navigation links for the Recruiter role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.RECRUITER})
    render(<MemoryRouter><Header currentPage="dashboard"/></MemoryRouter>);

    const dashboardLink = screen.queryByRole('link', {name: /dashboard/i});
    const applicantsLink = screen.queryByRole('link', {name: /applicants/i});
    const usersLink = screen.queryByRole('link', {name: /users/i});

    expect(dashboardLink).toBeInTheDocument();
    expect(applicantsLink).toBeInTheDocument();
    expect(usersLink).not.toBeInTheDocument();
  });

  it('renders the navigation links for the Interviewer role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: Roles.INTERVIEWER})
    render(<MemoryRouter><Header currentPage="dashboard"/></MemoryRouter>);

    const dashboardLink = screen.queryByRole('link', {name: /dashboard/i});
    const applicantsLink = screen.queryByRole('link', {name: /applicants/i});
    const usersLink = screen.queryByRole('link', {name: /users/i});

    expect(dashboardLink).toBeInTheDocument();
    expect(applicantsLink).toBeInTheDocument();
    expect(usersLink).not.toBeInTheDocument();
  });

  it('renders the navigation links for the No access role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({email: "", id: "", name: "", oid: "", role: ""})
    render(<MemoryRouter><Header currentPage="dashboard"/></MemoryRouter>);

    const dashboardLink = screen.queryByRole('link', {name: /dashboard/i});
    const applicantsLink = screen.queryByRole('link', {name: /applicants/i});
    const usersLink = screen.queryByRole('link', {name: /users/i});

    expect(dashboardLink).toBeInTheDocument();
    expect(applicantsLink).not.toBeInTheDocument();
    expect(usersLink).not.toBeInTheDocument();
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