import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import {router} from "../src/routerConfiguration.tsx";
import {StrictMode} from "react";

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

    expect(document.querySelector('main')).toBeInTheDocument();
    expect(document.querySelector('main')?.firstChild).toBeNull();
  });

  it('renders settings route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/settings']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('renders profile route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/profile']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });

  it('renders assessments route', () => {
    const testRouter = createMemoryRouter(router.routes, {initialEntries: ['/assessments']});

    render(<RouterProvider router={testRouter}/>);

    expect(screen.getByTestId('assessments')).toBeInTheDocument();
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