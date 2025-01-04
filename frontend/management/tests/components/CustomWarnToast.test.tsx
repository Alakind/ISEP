import CustomWarnToast from "../../src/components/CustomWarnToast.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe('CustomSWarnToast', () => {
  it('renders the toast message correctly', () => {
    render(
      <CustomWarnToast
        message="Are you sure you want to proceed?"
        proceedAction={() => {
        }}
        cancelAction={() => {
        }}
      />
    );

    const message = screen.getByText(/are you sure you want to proceed\?/i);
    expect(message).toBeInTheDocument();
  });

  it('calls the proceedAction when the proceed button is clicked', () => {
    const mockProceedAction = vi.fn();
    render(
      <CustomWarnToast
        message="Proceed with caution."
        proceedAction={mockProceedAction}
        cancelAction={() => {
        }}
      />
    );

    const proceedButton = screen.getByRole('button', {name: /proceed/i});
    fireEvent.click(proceedButton);

    expect(mockProceedAction).toHaveBeenCalled();
  });

  it('calls the cancelAction when the cancel button is clicked', () => {
    const mockCancelAction = vi.fn();
    render(
      <CustomWarnToast
        message="Proceed with caution."
        proceedAction={() => {
        }}
        cancelAction={mockCancelAction}
      />
    );

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(cancelButton);

    expect(mockCancelAction).toHaveBeenCalled();
  });

  it('renders both proceed and cancel buttons', () => {
    render(
      <CustomWarnToast
        message="Test buttons."
        proceedAction={() => {
        }}
        cancelAction={() => {
        }}
      />
    );

    const proceedButton = screen.getByText(/proceed/i);
    const cancelButton = screen.getByText(/cancel/i);

    expect(proceedButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('applies correct class names to the buttons', () => {
    render(
      <CustomWarnToast
        message="Test button classes."
        proceedAction={() => {
        }}
        cancelAction={() => {
        }}
      />
    );

    const proceedButton = screen.getByText(/proceed/i);
    const cancelButton = screen.getByText(/cancel/i);

    expect(proceedButton).toHaveClass('btn btn--toast btn--toast--proceed');
    expect(cancelButton).toHaveClass('btn btn--toast btn--toast--cancel');
  });
})