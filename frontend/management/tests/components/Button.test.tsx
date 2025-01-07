import Button from "../../src/components/Button.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe('Button component', () => {
  it('renders the button with the correct text', () => {
    render(
      <Button
        handleClick={() => {
        }}
        spanTextClass="btn-text"
        text="Click Me"
      />
    );

    const button = screen.getByRole('button', {name: /click me/i});
    expect(button).toBeInTheDocument();
  });

  it('applies the correct classes to the button', () => {
    render(
      <Button
        handleClick={() => {
        }}
        btnClasses="custom-class"
        spanTextClass="btn-text"
        text="Click Me"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn btn--mod custom-class');
  });

  it('renders the x icon when iconClass is provided', () => {
    render(
      <Button
        handleClick={() => {
        }}
        iconClass="bi-x"
        spanTextClass="btn-text"
        text="Click Me"
      />
    );

    const icon = document.querySelector('i');
    expect(icon).toHaveClass('bi bi-x');
  });

  it('disables the button when isDisabled is true', () => {
    render(
      <Button
        handleClick={() => {
        }}
        isDisabled={true}
        spanTextClass="btn-text"
        text="Click Me"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls the handleClick function when clicked', () => {
    const mockHandleClick = vi.fn();
    render(
      <Button
        handleClick={mockHandleClick}
        spanTextClass="btn-text"
        text="Click Me"
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockHandleClick).toHaveBeenCalled();
  });

  it('renders tooltip attributes when activeTooltip is true', () => {
    render(
      <Button
        handleClick={() => {
        }}
        activeTooltip={true}
        spanTextClass="btn-text"
        text="Tooltip Text"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-toggle', 'tooltip');
    expect(button).toHaveAttribute('data-placement', 'bottom');
    expect(button).toHaveAttribute('title', 'Tooltip Text');
  });

  it('does not render tooltip attributes when activeTooltip is false', () => {
    render(
      <Button
        handleClick={() => {
        }}
        activeTooltip={false}
        spanTextClass="btn-text"
        text="No Tooltip"
      />
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('data-toggle');
    expect(button).not.toHaveAttribute('data-placement');
    expect(button).not.toHaveAttribute('title');
  });
})