import LoadingPage from "../../src/components/LoadingPage.tsx";
import {render, screen} from "@testing-library/react";

describe('LoadingPage', () => {
  it('renders the loading spinner with default size', () => {
    render(<LoadingPage/>);

    const spinner = document.getElementsByTagName('svg')[0];
    expect(spinner).toBeInTheDocument();
    expect(spinner.parentElement).toHaveStyle('height: 80px');
    expect(spinner.parentElement).toHaveStyle('width: 80px');
  });

  it('renders the loading spinner with a custom size', () => {
    render(<LoadingPage size={100}/>);

    const spinner = document.getElementsByTagName('svg')[0];
    expect(spinner).toBeInTheDocument();
    expect(spinner.parentElement).toHaveStyle('height: 100px');
    expect(spinner.parentElement).toHaveStyle('width: 100px');
  });

  it('renders the default loading message', () => {
    render(<LoadingPage showMessage={true}/>);

    const message = screen.getByText(/loading.../i);
    expect(message).toBeInTheDocument();
  });

  it('renders a custom error message', () => {
    render(<LoadingPage showMessage={true} errorMessage="An error occurred"/>);

    const message = screen.getByText(/an error occurred/i);
    expect(message).toBeInTheDocument();
  });

  it('does not render a message when showMessage is false', () => {
    render(<LoadingPage showMessage={false}/>);

    const message = screen.queryByText(/loading.../i);
    expect(message).toBeNull();
  });

  it('applies additional CSS classes to the container', () => {
    render(<LoadingPage additionalClasses="custom-class"/>);

    const container = document.querySelector('div.page');
    expect(container).toHaveClass('custom-class');
  });
})