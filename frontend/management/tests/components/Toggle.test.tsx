import {fireEvent, render, screen} from '@testing-library/react';
import Toggle from "../../src/components/Toggle.tsx";

describe('Toggle', () => {
  it('renders correctly with given props', () => {
    render(
      <Toggle
        id="test-toggle"
        toggleValue={true}
        handleChange={() => {
        }}
        disabled={false}
        text={["OFF", "ON"]}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
    expect(screen.getByText('OFF')).toBeInTheDocument();
    expect(screen.getByText('ON')).toBeInTheDocument();
  });

  it('handles toggle changes correctly', () => {
    const mockHandleChange = vi.fn();
    render(
      <Toggle
        id="test-toggle"
        toggleValue={false}
        handleChange={mockHandleChange}
        disabled={false}
        text={["OFF", "ON"]}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(
      <Toggle
        id="test-toggle"
        toggleValue={false}
        handleChange={() => {
        }}
        disabled={true}
        text={["OFF", "ON"]}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('renders with single text when only one label is provided', () => {
    render(
      <Toggle
        id="test-toggle"
        toggleValue={true}
        handleChange={() => {
        }}
        disabled={false}
        text={["Toggle"]}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(screen.queryByText('ON')).toBeNull();
  });

  it('toggles checked state correctly based on toggleValue prop', () => {
    const {rerender} = render(
      <Toggle
        id="test-toggle"
        toggleValue={false}
        handleChange={() => {
        }}
        disabled={false}
        text={["OFF", "ON"]}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(
      <Toggle
        id="test-toggle"
        toggleValue={true}
        handleChange={() => {
        }}
        disabled={false}
        text={["OFF", "ON"]}
      />
    );

    expect(checkbox).toBeChecked();
  });
});
