import {render, screen} from "@testing-library/react";
import App from "../src/App.tsx";
import {expect} from "vitest";

describe('App Component', () => {
  it('renders the HeaderContainer', () => {
    render(
      <App/>
    );

    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('header')
  });

  it('renders the Outlet for nested routes', () => {
    render(
      <App/>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});