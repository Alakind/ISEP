import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import InvitesOverviewContainer from '../../../src/containers/applicant-personal/InvitesOverviewContainer';
import {toast} from 'react-toastify';
import {ApplicantInterface, AssessmentInterface, InviteInterface} from '../../../src/utils/types';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('InvitesOverviewContainer', () => {
  const mockInvitesData: InviteInterface[] = [
    {
      id: "cce487c0-9ff7-47a8-9844-b406e046459b",
      applicantId: "90",
      assessmentId: "3",
      status: "not_started",
      invitedAt: "2024-12-30T00:28:25.485108Z",
      expiresAt: "2025-01-10T00:28:25.485108Z"
    },
    {
      id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
      applicantId: "90",
      assessmentId: "4",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-15T00:28:25.485638Z"
    }
  ];

  const mockApplicant: ApplicantInterface = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    score: 85,
    statuses: ['not_started'],
    preferredLanguage: 'Kotlin',
    invites: [],
  };

  const mockAssessmentsData: AssessmentInterface[] = [
    {id: '3', tag: 'JAVA assessment', sections: [5, 6]},
    {id: '4', tag: 'SQL assessment', sections: [7, 8]},
  ];

  const mockSetInvitesData = vi.fn();
  const mockSetApplicant = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render invites with formatted expiration dates', () => {
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const expirationDateInputs = screen.getAllByLabelText(/Available till:/i);
    expect(expirationDateInputs).toHaveLength(mockInvitesData.length);

    // Verify formatted expiration dates
    expect(expirationDateInputs[0]).toHaveValue('2025-01-10');
    expect(expirationDateInputs[1]).toHaveValue('2025-01-15');
  });

  it('should update expiration date when a valid date is selected', async () => {
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const expirationDateInputs = screen.getAllByLabelText(/Available till:/i);
    fireEvent.change(expirationDateInputs[0], {target: {value: '2025-01-20'}});

    // Verify the input value is updated
    await waitFor(() => {
      expect(expirationDateInputs[0]).toHaveValue('2025-01-20');
    });
  });

  it('should show an error toast when a past date is selected', async () => {
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const expirationDateInputs = screen.getAllByLabelText(/Available till:/i);
    fireEvent.change(expirationDateInputs[0], {target: {value: '2024-01-01'}});

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'You can\'t select a date in the past!'
      );
    });

    // Verify the input value is not updated
    expect(expirationDateInputs[0]).toHaveValue('2025-01-10');
  });

  it('should not call toast.error for the same expiration date', async () => {
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const expirationDateInputs = screen.getAllByLabelText(/Available till:/i);
    fireEvent.change(expirationDateInputs[0], {target: {value: '2025-01-10'}});

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled();
    });

    // Verify the input value remains the same
    expect(expirationDateInputs[0]).toHaveValue('2025-01-10');
  });
});
