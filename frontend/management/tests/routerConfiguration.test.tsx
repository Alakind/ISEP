import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import {router} from "../src/routerConfiguration.tsx";
import {ReactNode, StrictMode} from "react";
import {vi} from "vitest";
import {Roles} from "../src/utils/constants.tsx";

vi.mock("../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

vi.mock("@azure/msal-react", () => ({
  AuthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  UnauthenticatedTemplate: ({children}: { children: ReactNode }) => <>{children}</>,
  useMsal: vi.fn(() => ({
    instance: {
      getActiveAccount: vi.fn(() => ({username: "testuser@gmail.com"})),
    },
  })),
}));

vi.mock("../src/utils/msal/MsUserProvider.tsx", () => ({
  MsUserProvider: ({children}: { children: ReactNode }) => <>{children}</>
}))

vi.mock("../src/utils/msal/UserProvider.tsx", () => ({
  UserProvider: ({children}: { children: ReactNode }) => <>{children}</>
}))

describe('Router Configuration', () => {
  it('renders the application without crashing', () => {
    // Ensure a root container exists
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    render(
      <StrictMode>
        <RouterProvider router={router}/>
      </StrictMode>,
      {container: root}
    );

    expect(document.getElementById('root')).toBeInTheDocument();
  });

  it('renders general route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByText("Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the Applicants page. To view the roles of users navigate to the Users page.")).toBeInTheDocument();
  });

  it('renders users route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/users']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('users-list-page')).toBeInTheDocument();
  });

  it('renders applicants route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/applicants']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('applicants-list-page')).toBeInTheDocument();
  });

  it('renders applicants add route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/applicants/add']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('applicant-add-card')).toBeInTheDocument();
  });

  it('renders applicant info route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/applicants/1/info']});

    render(<RouterProvider router={testRouter}/>);
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

  it('renders invite add route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/applicants/1/invite/add']});

    render(<RouterProvider router={testRouter}/>);
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

});