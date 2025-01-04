import ErrorBoundary from "../../src/components/ErrorBoundary.tsx";
import {render, screen} from "@testing-library/react";

describe('ErrorBoundary', () => {
  it('renders the error message correctly', () => {
    const error = new Error('Test error message');

    render(<ErrorBoundary error={error}/>);

    const heading = screen.getByRole('heading');
    const message = screen.getByText(/test error message/i);

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/something went wrong!/i);
    expect(message).toBeInTheDocument();
  });

  it('renders a default message if no error is provided', () => {
    render(<ErrorBoundary/>);

    const heading = screen.getByRole('heading');
    const message = screen.getByText(/page not found/i);

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/something went wrong!/i);
    expect(message).toBeInTheDocument();
  });
})