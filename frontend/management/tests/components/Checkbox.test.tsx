import Checkbox from "../../src/components/Checkbox.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe('Checkbox', () => {
  it('renders the checkbox with correct initial state', () => {
    render(
      <Checkbox
        id="test-checkbox"
        handleOptionChange={() => {
        }}
        isChecked={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders the checkbox as checked when isChecked is true', () => {
    render(
      <Checkbox
        id="test-checkbox"
        handleOptionChange={() => {
        }}
        isChecked={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls handleOptionChange with correct id when clicked', () => {
    const mockHandleOptionChange = vi.fn();
    render(
      <Checkbox
        id="test-checkbox"
        handleOptionChange={mockHandleOptionChange}
        isChecked={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandleOptionChange).toHaveBeenCalledWith('test-checkbox');
  });

  it('applies the correct class when checked', () => {
    render(
      <Checkbox
        id="test-checkbox"
        handleOptionChange={() => {
        }}
        isChecked={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checkbox__input checkbox__input--checked');
  });

  it('does not apply the checked class when unchecked', () => {
    render(
      <Checkbox
        id="test-checkbox"
        handleOptionChange={() => {
        }}
        isChecked={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checkbox__input');
    expect(checkbox).not.toHaveClass('checkbox__input--checked');
  });
})