import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import ApplicantPersonalCard from "../../../src/components/applicant-personal/ApplicantPersonalCard.tsx";
import {Roles} from "../../../src/utils/constants.tsx";

vi.mock("../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

const mockApplicant = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  preferredLanguage: 'English',
};

describe('ApplicantPersonalCard Component', () => {
  const mockHandleChange = vi.fn();
  const mockHandleEdit = vi.fn();
  const mockHandleDelete = vi.fn();
  const mockHandleInvite = vi.fn();
  const mockHandleSave = vi.fn();
  const mockHandleCancel = vi.fn();

  it('renders the applicant details form', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={false}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const container = screen.getByTestId("applicant-personal-card");
    expect(container).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const languageInput = screen.getByLabelText(/preferred language/i);

    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(mockApplicant.name);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue(mockApplicant.email);
    expect(languageInput).toBeInTheDocument();
    expect(languageInput).toHaveValue(mockApplicant.preferredLanguage);
  });

  it('calls handleChange when inputs are modified in editing mode', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={true}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, {target: {value: 'Jane Doe'}});

    expect(mockHandleChange).toHaveBeenCalledWith(expect.anything());
  });

  it('renders edit, delete, and invite buttons when not in editing mode', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={false}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const editButton = screen.getByText(/edit/i);
    const deleteButton = screen.getByText(/delete/i);
    const inviteButton = screen.getByText(/invite/i);

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(inviteButton).toBeInTheDocument();
  });

  it('renders save and cancel buttons in editing mode', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={true}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const saveButton = screen.getByText(/save/i);
    const cancelButton = screen.getByText(/cancel/i);

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('calls handleEdit when edit button is clicked', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={false}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(mockHandleEdit).toHaveBeenCalled();
  });

  it('calls handleDelete when delete button is clicked', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={false}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalled();
  });

  it('calls handleInvite when invite button is clicked', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={false}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const inviteButton = screen.getByText(/invite/i);
    fireEvent.click(inviteButton);

    expect(mockHandleInvite).toHaveBeenCalled();
  });

  it('calls handleSave when save button is clicked in editing mode', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={true}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    expect(mockHandleSave).toHaveBeenCalled();
  });

  it('calls handleCancel when cancel button is clicked in editing mode', () => {
    render(
      <ApplicantPersonalCard
        applicant={mockApplicant}
        handleChange={mockHandleChange}
        handleEdit={mockHandleEdit}
        handleDelete={mockHandleDelete}
        handleInvite={mockHandleInvite}
        isEditing={true}
        handleSave={mockHandleSave}
        handleCancel={mockHandleCancel}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });
});