import {render, screen} from "@testing-library/react";
import App from "../src/App.tsx";
import {expect} from "vitest";
import {MemoryRouter} from "react-router-dom";

describe('App Component', () => {
  it('renders the HeaderContainer', () => {
    render(
      <MemoryRouter>
        <App/>
      </MemoryRouter>
    );

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('header')
  });

  it('renders the Outlet for nested routes', () => {
    render(
      <MemoryRouter>
        <App/>
      </MemoryRouter>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});