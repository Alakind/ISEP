import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import InvitesOverviewContainer from '../../../src/containers/applicant-personal/InvitesOverviewContainer';
import {toast} from 'react-toastify';
import {ApplicantInterface, AssessmentInterface, InviteInterface} from '../../../src/utils/types';
import {deleteInvite, sendMail, updateInvite} from "../../../src/utils/apiFunctions.tsx";
import {act} from "react";
import {vi} from "vitest";
import {EmailTypes} from "../../../src/utils/constants.tsx";

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('../../../src/utils/apiFunctions.tsx', () => ({
  updateInvite: vi.fn(),
  deleteInvite: vi.fn(),
  sendMail: vi.fn(),
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
    vi.resetAllMocks();
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
    vi.mocked(updateInvite).mockRejectedValueOnce(null);
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

  it('should handle a call to handleCancel', async () => {
    vi.mocked(updateInvite).mockResolvedValueOnce({data: {status: "cancelled"}});
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    act(() => {
      fireEvent.click(cancelButton);
    })

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Successfully cancelled invite");
    })
  });

  it('should handle a call to updateInvite and handles error gracefully', async () => {
    vi.mocked(updateInvite).mockRejectedValueOnce(new Error(`Failed to cancel invite`));
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    act(() => {
      fireEvent.click(cancelButton);
    })

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Failed to cancel invite");
    })
  });

  it('should handle a call to updateInvite and handles error gracefully (unknown error)', async () => {
    vi.mocked(updateInvite).mockRejectedValueOnce(null);
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    act(() => {
      fireEvent.click(cancelButton);
    })

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.");
    })
  });

  it('should handle a call to handleCancel with not cancellable status', async () => {
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[1]; // cancel button of second invite block
    act(() => {
      fireEvent.click(cancelButton);
    })

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledTimes(0);
      expect(toast.success).not.toHaveBeenCalledWith("Successfully cancelled invite");
    })
  });

  it('should handle a call to handleDelete', async () => {
    vi.mocked(deleteInvite).mockResolvedValueOnce("Successfully deleted invite")
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    act(() => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

      proceedAction();
    })

    await waitFor(() => {
      expect(deleteInvite).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Successfully deleted invite");
    })
  });

  it('should handle a call to handleDelete', async () => {
    vi.mocked(deleteInvite).mockResolvedValueOnce("Successfully deleted invite")
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    act(() => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

      proceedAction();
    })

    await waitFor(() => {
      expect(deleteInvite).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Successfully deleted invite");
    })
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(deleteInvite).mockRejectedValueOnce(new Error('Failed to delete invite'));

    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    act(() => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

      proceedAction();
    })

    await waitFor(() => {
      expect(deleteInvite).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Failed to delete invite");
    })
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    vi.mocked(deleteInvite).mockRejectedValueOnce(null);

    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    act(() => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

      proceedAction();
    })

    await waitFor(() => {
      expect(deleteInvite).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.");
    })
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    vi.mocked(deleteInvite).mockRejectedValueOnce(null);

    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        setInvitesData={mockSetInvitesData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    act(() => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const cancelAction = vi.mocked(toast.warn).mock.lastCall[0].props.cancelAction;

      cancelAction();
    })

    await waitFor(() => {
      expect(deleteInvite).toHaveBeenCalledTimes(0);
      expect(toast.info).toHaveBeenCalledWith("Invite hasn't been deleted!");
    })
  });

  it("handles sending first reminder", async () => {
    vi.mocked(updateInvite).mockResolvedValueOnce({data: {status: "app_reminded_once"}});
    vi.mocked(sendMail).mockResolvedValueOnce("Successfully send email request");

    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        setInvitesData={mockSetInvitesData}
        assessmentsData={mockAssessmentsData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const remindButton = screen.getAllByRole("button", {name: /remind/i})[0];
    fireEvent.click(remindButton);

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledWith(mockInvitesData[0].id, {status: "app_reminded_once"});
      expect(sendMail).toHaveBeenCalledWith(mockApplicant.id, mockInvitesData[0].id, EmailTypes.REMINDER);
      expect(toast.success).toHaveBeenCalledWith("Successfully emailed reminder.");
    });
  });

  it("handles sending second reminder", async () => {
    vi.mocked(updateInvite).mockResolvedValueOnce({data: {status: "app_reminded_twice"}});
    vi.mocked(sendMail).mockResolvedValueOnce("Successfully send email request");
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_reminded_once",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-10T00:28:25.485108Z"
      }
    ];
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        setInvitesData={mockSetInvitesData}
        assessmentsData={mockAssessmentsData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const remindButton = screen.getAllByRole("button", {name: /remind/i})[0];
    fireEvent.click(remindButton);

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledWith(mockInvitesData[0].id, {status: "app_reminded_twice"});
      expect(sendMail).toHaveBeenCalledWith(mockApplicant.id, mockInvitesData[0].id, EmailTypes.REMINDER);
      expect(toast.success).toHaveBeenCalledWith("Successfully emailed reminder.");
    });
  });

  it("handles sending second reminder and handles the error gracefully", async () => {
    vi.mocked(updateInvite).mockResolvedValueOnce({data: {status: "app_reminded_twice"}});
    vi.mocked(sendMail).mockRejectedValueOnce(new Error("Failed to send email request"));
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_reminded_once",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-10T00:28:25.485108Z"
      }
    ];
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        setInvitesData={mockSetInvitesData}
        assessmentsData={mockAssessmentsData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const remindButton = screen.getAllByRole("button", {name: /remind/i})[0];
    fireEvent.click(remindButton);

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledWith(mockInvitesData[0].id, {status: "app_reminded_twice"});
      expect(sendMail).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Failed to send email request");
    });
  });

  it("handles sending second reminder and handles the error gracefully (unknown error)", async () => {
    vi.mocked(updateInvite).mockResolvedValueOnce({data: {status: "app_reminded_twice"}});
    vi.mocked(sendMail).mockRejectedValueOnce(null);
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_reminded_once",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-10T00:28:25.485108Z"
      }
    ];
    render(
      <InvitesOverviewContainer
        invitesData={mockInvitesData}
        setInvitesData={mockSetInvitesData}
        assessmentsData={mockAssessmentsData}
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    const remindButton = screen.getAllByRole("button", {name: /remind/i})[0];
    fireEvent.click(remindButton);

    await waitFor(() => {
      expect(updateInvite).toHaveBeenCalledWith(mockInvitesData[0].id, {status: "app_reminded_twice"});
      expect(sendMail).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.");
    });
  });
});
