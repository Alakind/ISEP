import CheckboxLoading from "../../src/components/CheckboxLoading.tsx";
import {render, screen} from "@testing-library/react";

describe('CheckboxLoading component', () => {
  it('renders the checkbox with the loading class', () => {
    render(<CheckboxLoading id="test-checkbox-loading"/>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('checkbox__input checkbox__input--loading');
  });

  it('renders the checkbox as disabled', () => {
    render(<CheckboxLoading id="test-checkbox-loading"/>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('applies the correct id to the checkbox', () => {
    render(<CheckboxLoading id="test-checkbox-loading"/>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox-loading');
  });
})