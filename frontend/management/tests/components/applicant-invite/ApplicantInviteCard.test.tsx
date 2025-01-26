import ApplicantInviteCard from "../../../src/components/applicant-invite/ApplicantInviteCard.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import {AssessmentInterface, InviteInterface} from "../../../src/utils/types.tsx";

const mockAssessmentsData: AssessmentInterface[] = [
  {
    id: "3",
    tag: "JAVA assessment",
    sections: [
      5,
      6
    ]
  },
  {
    id: "4",
    tag: "SQL assessment",
    sections: [
      7,
      8
    ]
  }
];

const mockInviteData: InviteInterface = {
  id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
  applicantId: "90",
  assessmentId: "4",
  status: "app_finished",
  invitedAt: "2024-12-30T00:28:25.485638Z",
  expiresAt: "2025-01-06T00:28:25.485638Z",
  measuredSecondsPerSection: []
};

describe('ApplicantInviteCard Component', () => {
  const mockProps = {
    applicantEmail: 'test@example.com',
    assessmentsData: mockAssessmentsData,
    handleCancel: vi.fn(),
    handleInvite: vi.fn(),
    handleSelect: vi.fn(),
    selectedOption: 0,
    handleToggleMail: vi.fn(),
    expirationDate: '2024-12-31',
    handleChangeExpirationDate: vi.fn(),
    inviteData: mockInviteData,
    toggleValue: true,
    handleChangeEmail: vi.fn(),
    editingEmail: false,
    handleEditingEmail: vi.fn(e => e.preventDefault()),
    handleCancelEditingEmail: vi.fn(e => e.preventDefault()),
    handleMessageChange: vi.fn(),
    message: "Dear John Doe,\\n\\nWe would like to invite you to do the following assessment %INVITE_LINK%.\\n\\nGreetings,\\nInfoSupport"
  };

  it('renders the invitation settings form', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const settingsForm = screen.getByTestId(/invitation-settings/i);
    const assessmentLabel = screen.getByLabelText(/assessment/i);
    const mailToggleLabel = screen.getByLabelText(/send invitation mail/i);
    const expirationLabel = screen.getByLabelText(/invitation will be valid for/i);

    expect(settingsForm).toBeInTheDocument()
    expect(assessmentLabel).toBeInTheDocument();
    expect(mailToggleLabel).toBeInTheDocument();
    expect(expirationLabel).toBeInTheDocument();
  });

  it('renders the invitation mail form', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const mailForm = screen.getByTestId(/invitation-mail/i);
    const toLabel = screen.getByLabelText(/to/i);
    const messageLabel = screen.getByLabelText(/message/i);

    expect(mailForm).toBeInTheDocument()
    expect(toLabel).toBeInTheDocument();
    expect(messageLabel).toBeInTheDocument();
  });

  it('calls handleSelect when an assessment is selected', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const selectElement = screen.getByLabelText(/assessment/i);
    fireEvent.change(selectElement, {target: {value: '2'}});

    expect(mockProps.handleSelect).toHaveBeenCalled();
  });

  it('renders the applicant email and allows editing', () => {
    render(<ApplicantInviteCard {...mockProps} editingEmail={true}/>);

    const toInput = screen.getByLabelText(/to/i);
    expect(toInput).toBeInTheDocument();
    expect(toInput).toHaveValue(mockProps.applicantEmail);

    fireEvent.change(toInput, {target: {value: 'new@example.com'}});
    expect(mockProps.handleChangeEmail).toHaveBeenCalled();
  });

  it('calls handleInvite when the invite button is clicked', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const inviteButton = screen.getByText("Invite");
    fireEvent.click(inviteButton);

    expect(mockProps.handleInvite).toHaveBeenCalled();
  });

  it('disables the invite button if email is invalid', () => {
    render(
      <ApplicantInviteCard
        {...mockProps}
        applicantEmail=""
      />
    );

    const inviteButton = screen.getByText("Invite");
    expect(inviteButton.parentElement).toBeDisabled();
  });

  it('disables the invite button if assessment is invalid', () => {
    render(
      <ApplicantInviteCard
        {...mockProps}
        inviteData={{...mockInviteData, assessmentId: "0"}}
      />
    );

    const inviteButton = screen.getByText("Invite");
    expect(inviteButton.parentElement).toBeDisabled();
  });

  it('disables the invite button if email and assessment is invalid', () => {
    render(
      <ApplicantInviteCard
        {...mockProps}
        applicantEmail=""
        inviteData={{...mockInviteData, assessmentId: '0'}}
      />
    );

    const inviteButton = screen.getByText("Invite");
    expect(inviteButton.parentElement).toBeDisabled();
  });

  it('renders the invitation mail message', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const messageTextarea = screen.getByLabelText(/message/i);
    expect(messageTextarea).toBeInTheDocument();
    expect(messageTextarea).toHaveValue(mockProps.message);
  });

  it('allows editing the invitation mail message', () => {
    render(<ApplicantInviteCard {...mockProps} toggleValue={true}/>);

    const messageTextarea = screen.getByLabelText(/message/i);
    fireEvent.change(messageTextarea, {target: {value: 'New message content'}});
    expect(mockProps.handleMessageChange).toHaveBeenCalledWith(expect.anything());
  });

  it('disables message editing when toggleValue is false', () => {
    render(<ApplicantInviteCard {...mockProps} toggleValue={false}/>);

    const messageTextarea = screen.getByLabelText(/message/i);
    expect(messageTextarea).toBeDisabled();
  });

  it('calls handleChangeExpirationDate when expiration date is changed', () => {
    render(<ApplicantInviteCard {...mockProps} />);

    const expirationDateElement = screen.getByLabelText(/invitation will be valid for/i);
    fireEvent.change(expirationDateElement, {target: {value: '2025-01-01'}});

    expect(mockProps.handleChangeExpirationDate).toHaveBeenCalled();
  });

  it('calls handleCancelEditingEmail when button is pressed', () => {
    render(<ApplicantInviteCard {...mockProps} toggleValue={true} editingEmail={true}/>);

    const cancelButton = document.querySelector('button i.bi-x-lg')?.parentElement;
    expect(cancelButton).toBeInTheDocument();
    if (cancelButton) {
      fireEvent.click(cancelButton);

      expect(mockProps.handleCancelEditingEmail).toHaveBeenCalledWith(expect.anything());
    }
  });

  it('does not call handleCancelEditingEmail when button is disabled', () => {
    render(<ApplicantInviteCard {...mockProps} editingEmail={true} toggleValue={false}/>);

    const cancelButton = screen.getAllByRole('button')[2];
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveClass('input-email--disabled');
  });

  it('does not call handleCancelEditingEmail when button is disabled', () => {
    render(<ApplicantInviteCard {...mockProps} editingEmail={true} toggleValue={true}/>);

    const cancelButton = screen.getAllByRole('button')[2];
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).not.toHaveClass('input-email--disabled');
  });

  it('calls handleEditingEmail when button is pressed to save email', () => {
    render(<ApplicantInviteCard {...mockProps} toggleValue={true} editingEmail={true}/>);

    const saveButton = screen.getAllByRole('button')[3];
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    expect(mockProps.handleEditingEmail).toHaveBeenCalledWith(expect.anything());
  });

  it('calls handleEditingEmail when button is pressed to edit email', () => {
    render(<ApplicantInviteCard {...mockProps} toggleValue={true} editingEmail={false}/>);

    const editButton = screen.getAllByRole('button')[2];
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);

    expect(mockProps.handleEditingEmail).toHaveBeenCalledWith(expect.anything());
  });

  it('highlights the default option when selectedOption is 0', () => {
    render(<ApplicantInviteCard {...mockProps} selectedOption={0}/>);

    const defaultOption = screen.getByText(/choose an option/i);
    expect(defaultOption).toBeInTheDocument();
    expect(defaultOption.parentElement).toHaveClass('dropdown__select__default-option');
  });

  it('does not highlight the default option when selectedOption is not 0', () => {
    render(<ApplicantInviteCard {...mockProps} selectedOption={1}/>);

    const defaultOption = screen.getByText(/java assessment/i);
    expect(defaultOption).toBeInTheDocument();
    expect(defaultOption.parentElement).not.toHaveClass('dropdown__select__default-option');
  });
})