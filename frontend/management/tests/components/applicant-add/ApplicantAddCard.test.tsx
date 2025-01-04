import {ApplicantInterface} from "../../../src/utils/types.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import ApplicantAddCard from "../../../src/components/applicant-add/ApplicantAddCard.tsx";

describe('ApplicantAddCard component', () => {
  const mockNewApplicant: ApplicantInterface = {
    id: '',
    name: '',
    email: '',
    preferredLanguage: ''
  };

  const mockHandleCancel = vi.fn();
  const mockHandleAdd = vi.fn();
  const mockHandleChange = vi.fn();

  it('renders the form fields with correct labels and initial values', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const languageInput = screen.getByLabelText(/preferred language/i);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(languageInput).toBeInTheDocument();

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(languageInput).toHaveValue('');
  });

  it('calls handleChange when name input value', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, {target: {value: 'John Doe'}});

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleChange when email input value', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, {target: {value: 'johndoe@gmail.com'}});

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleChange when preferred language input value', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const preferredLanguageInput = screen.getByLabelText(/preferred language/i);
    fireEvent.change(preferredLanguageInput, {target: {value: 'Kotlin'}});

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleCancel when the Cancel button is clicked', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it('calls handleAdd with false when the Add button is clicked', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockHandleAdd).toHaveBeenCalledWith(false);
  });

  it('calls handleAdd with true when the Add & Invite button is clicked', () => {
    render(
      <ApplicantAddCard
        newApplicant={mockNewApplicant}
        handleCancel={mockHandleCancel}
        handleAdd={mockHandleAdd}
        handleChange={mockHandleChange}
      />
    );

    const addInviteButton = screen.getByText(/add & invite/i);
    fireEvent.click(addInviteButton);

    expect(mockHandleAdd).toHaveBeenCalledWith(true);
  });
})
