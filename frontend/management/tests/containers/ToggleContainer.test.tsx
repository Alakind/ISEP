import {render, screen} from "@testing-library/react";
import ToggleContainer from "../../src/containers/ToggleContainer.tsx";
import {expect} from "vitest";

describe("ToggleContainer", () => {
  const mockHandleChange = vi.fn();

  const defaultProps = {
    id: 'test-toggle',
    disabled: false,
    handleChange: mockHandleChange,
    toggleValue: false,
    text: ['OFF', 'ON'],
  };

  it('renders the Toggle component with correct props', () => {
    render(<ToggleContainer {...defaultProps} />);

    const toggleElement = screen.getByTestId('toggle');
    expect(toggleElement).toBeInTheDocument();
  });

  it('renders the Toggle component with correct props when disabled is undefined', () => {
    render(<ToggleContainer {...defaultProps} disabled={undefined}/>);

    const toggleElement = screen.getByTestId('toggle');
    expect(toggleElement).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeDisabled();
  });
})