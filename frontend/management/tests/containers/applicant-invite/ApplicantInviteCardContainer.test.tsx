import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ApplicantInviteCardContainer from '../../../src/containers/applicant-invite/ApplicantInviteCardContainer';
import {addInvite, getApplicant, getAssessments, sendMail, updateApplicant} from '../../../src/utils/apiFunctions';
import {MemoryRouter, Route, Routes, useNavigate} from 'react-router-dom';
import {ApplicantInterface, AssessmentInterface} from "../../../src/utils/types.tsx";
import {vi} from "vitest";
import {toast} from "react-toastify";
import {getDateFormatted} from "../../../src/utils/general.tsx";
import {act} from "react";

vi.mock('../../../src/utils/apiFunctions', () => ({
  getApplicant: vi.fn(),
  getAssessments: vi.fn(),
  addInvite: vi.fn(),
  updateApplicant: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = vi.fn();

describe('ApplicantInviteCardContainer', () => {
  const mockApplicant: ApplicantInterface = {
    preferredLanguage: "Kotlin",
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  const mockAssessments: AssessmentInterface[] = [
    {id: '1', tag: 'Assessment 1', sections: []},
    {id: '2', tag: 'Assessment 2', sections: []},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should fetch applicant and assessments data on load', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(getAssessments).toHaveBeenCalledWith(0, -1, '', 'tag,desc');
    });

    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    expect(screen.getByText('Assessment 2')).toBeInTheDocument();
  });

  it('should show an error toast if fetching applicant data fails', async () => {
    vi.mocked(getApplicant).mockRejectedValueOnce(new Error('Failed to fetch applicant data'));

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch applicant data');

      expect(mockNavigate).toHaveBeenCalledWith('/applicants/1/info');
    });

    expect(screen.queryByDisplayValue('john.doe@example.com')).not.toBeInTheDocument();
  });

  it('should show an error toast if fetching applicant data fails (unknown error)', async () => {
    vi.mocked(getApplicant).mockRejectedValueOnce(null);

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
      expect(mockNavigate).toHaveBeenCalledWith('/applicants/1/info');
    });

    expect(screen.queryByDisplayValue('john.doe@example.com')).not.toBeInTheDocument();
  });

  it('should handle invite action successfully', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(addInvite).mockResolvedValueOnce("fd5b4873-89c1-4255-88eb-f217ff1405ab");
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      expect(inviteButton).toBeDisabled();
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      expect(inviteButton).not.toBeDisabled();
      fireEvent.click(inviteButton);
    });

    const today = new Date();
    const todayPlusWeek = getDateFormatted(new Date(today.setDate(today.getDate() + 7)).toString());

    await waitFor(() => {
      expect(addInvite).toHaveBeenCalledWith('1', '1', todayPlusWeek);
      expect(toast.success).toHaveBeenCalledWith('Applicant successfully invited.');
    });
  });

  it('should show an error toast if inviting applicant fails', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(addInvite).mockRejectedValueOnce(new Error('Failed to add invite'));

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      expect(inviteButton).toBeDisabled();
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      expect(inviteButton).not.toBeDisabled();
      fireEvent.click(inviteButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add invite');
    });
  });

  it('should show an error toast if inviting applicant fails (unknown error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(addInvite).mockRejectedValueOnce(null);

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      expect(inviteButton).toBeDisabled();
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      expect(inviteButton).not.toBeDisabled();
      fireEvent.click(inviteButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('should switch between disabled and not disabled state of invite button when selecting assessment, which isn\'t the default', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      expect(inviteButton).toBeDisabled();
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      expect(inviteButton).not.toBeDisabled();
      fireEvent.change(assessmentSelect, {target: {value: 'default'}});
      expect(inviteButton).toBeDisabled();
    });
  });

  it('should show an error toast if fetching assessment data fails', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockRejectedValueOnce(new Error('Failed to retrieve assessments'));

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to retrieve assessments');
    });
  });


  it('should show an error toast if fetching assessment data fails (unknown error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockRejectedValueOnce(null);

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('should handle email editing and updating successfully', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(updateApplicant).mockResolvedValueOnce({data: {email: 'updated.email@example.com'}});
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', {name: ""}));
      fireEvent.change(screen.getByRole('textbox', {name: "To:"}), {target: {value: 'updated.email@example.com'}});
      fireEvent.click(screen.getAllByRole('button', {name: ""})[1]);
    })

    await waitFor(() => {
      expect(updateApplicant).toHaveBeenCalledWith('1', {email: 'updated.email@example.com'});
      expect(toast.success).toHaveBeenCalledWith('Email successfully updated');
      expect(screen.getByRole('textbox', {name: "To:"})).toHaveValue('updated.email@example.com');
    });
  });

  it('should handle email editing and restore to old value on cancel', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(updateApplicant).mockClear();

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    act(() => {
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', {name: ""}));
      fireEvent.change(screen.getByRole('textbox', {name: "To:"}), {target: {value: 'updated.email@example.com'}});
      fireEvent.click(screen.getAllByRole('button', {name: ""})[0]); // click on x button (cancel)
    })

    await waitFor(() => {
      expect(updateApplicant).not.toHaveBeenCalledWith('1', {email: 'updated.email@example.com'});
      expect(toast.success).not.toHaveBeenCalledWith('Email successfully updated');
      expect(screen.getByRole('textbox', {name: "To:"})).toHaveValue('john.doe@example.com');
    });
  });

  it('should handle email editing and throw error', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(updateApplicant).mockRejectedValueOnce(new Error("Couldn't update email"));
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', {name: ""}));
      fireEvent.change(screen.getByRole('textbox', {name: "To:"}), {target: {value: 'updated.email@example.com'}});
      fireEvent.click(screen.getAllByRole('button', {name: ""})[1]);
    })

    await waitFor(() => {
      const emailInput = screen.getByRole('textbox', {name: "To:"});
      expect(updateApplicant).toHaveBeenCalledWith('1', {email: 'updated.email@example.com'});
      expect(toast.error).toHaveBeenCalledWith('Couldn\'t update email');
      expect(emailInput).toHaveValue('john.doe@example.com');
    });
  });

  it('should handle email editing and throw unknown error', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(updateApplicant).mockRejectedValueOnce(null);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', {name: ""}));
      fireEvent.change(screen.getByRole('textbox', {name: "To:"}), {target: {value: 'updated.email@example.com'}});
      fireEvent.click(screen.getAllByRole('button', {name: ""})[1]);
    })

    await waitFor(() => {
      const emailInput = screen.getByRole('textbox', {name: "To:"});
      expect(updateApplicant).toHaveBeenCalledWith('1', {email: 'updated.email@example.com'});
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
      expect(emailInput).toHaveValue('john.doe@example.com');
    });
  });

  it('should switch between disabled stated of the email edit input', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    const emailEdit = screen.getByRole('button', {name: ""});
    const invitationMailSwitch = screen.getByRole('checkbox');
    expect(emailEdit).toHaveClass("input-email--disabled");
    expect(invitationMailSwitch).not.toBeChecked();

    act(() => {
      fireEvent.click(invitationMailSwitch);
    })

    expect(invitationMailSwitch).toBeChecked();
    expect(emailEdit).not.toHaveClass("input-email--disabled");

    act(() => {
      fireEvent.click(invitationMailSwitch);
    })

    expect(invitationMailSwitch).not.toBeChecked();
    expect(emailEdit).toHaveClass("input-email--disabled");
  });

  it('should validate expiration date and show error if it is in the past', async () => {
    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
    });

    act(() => {
      const expirationInput = screen.getByLabelText(/Invitation will be valid for 7 days and will expire on:/i);
      fireEvent.change(expirationInput, {target: {value: '2023-01-01'}});
    })
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Select today or a day in the future.');
    });
  });

  it('should navigate to applicant page on cancel', async () => {
    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      const cancelButton = screen.getByRole('button', {name: /cancel/i});
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/applicants/1/info');
    })
  });

  it('should validate expiration date ', async () => {
    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      const expirationInput = screen.getByLabelText(/Invitation will be valid for 7 days and will expire on:/i);

      const today = new Date();
      today.setDate(today.getDate() + 10);
      const yyyy: number = today.getFullYear();
      const mm: string = String(today.getMonth() + 1).padStart(2, '0');
      const dd: string = String(today.getDate()).padStart(2, '0');
      fireEvent.change(expirationInput, {target: {value: `${yyyy}-${mm}-${dd}`}});

      expect(mockNavigate).toHaveBeenCalledWith('/applicants/1/info');
    })
  });

  it('should handle invite action successfully and mail invitation when activated', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(addInvite).mockResolvedValueOnce("fd5b4873-89c1-4255-88eb-f217ff1405ab");
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(sendMail).mockResolvedValueOnce("Successfully send email request")

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      fireEvent.click(inviteButton);
    });

    const today = new Date();
    const todayPlusWeek = getDateFormatted(new Date(today.setDate(today.getDate() + 7)).toString());

    await waitFor(() => {
      expect(addInvite).toHaveBeenCalledWith('1', '1', todayPlusWeek);
      expect(toast.success).toHaveBeenCalledWith('Applicant successfully invited.');
      expect(toast.success).toHaveBeenCalledWith("Successfully emailed invitation.")
    });
  });

  it('should handle invite action successfully and mail invitation when activated and handles error gracefully', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(addInvite).mockResolvedValueOnce("fd5b4873-89c1-4255-88eb-f217ff1405ab");
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(sendMail).mockRejectedValueOnce(new Error('Failed to send email request'));

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      fireEvent.click(inviteButton);
    });

    const today = new Date();
    const todayPlusWeek = getDateFormatted(new Date(today.setDate(today.getDate() + 7)).toString());

    await waitFor(() => {
      expect(addInvite).toHaveBeenCalledWith('1', '1', todayPlusWeek);
      expect(toast.success).toHaveBeenCalledWith('Applicant successfully invited.');
      expect(toast.error).toHaveBeenCalledWith("Failed to send email request")
    });
  });

  it('should handle invite action successfully and mail invitation when activated and handles error gracefully (unknown error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(addInvite).mockResolvedValueOnce("fd5b4873-89c1-4255-88eb-f217ff1405ab");
    vi.mocked(getAssessments).mockResolvedValueOnce({data: mockAssessments, totalItems: 2});
    vi.mocked(sendMail).mockRejectedValueOnce(null)

    render(
      <MemoryRouter initialEntries={["/applicants/1/invite/add"]}>
        <Routes>
          <Route path="/applicants/:id/invite/add" element={<ApplicantInviteCardContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    await waitFor(() => {
      const assessmentSelect = screen.getByLabelText(/Assessment:/i);
      const inviteButton = screen.getByRole('button', {name: /invite/i});

      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.change(assessmentSelect, {target: {value: '1'}});
      fireEvent.click(inviteButton);
    });

    const today = new Date();
    const todayPlusWeek = getDateFormatted(new Date(today.setDate(today.getDate() + 7)).toString());

    await waitFor(() => {
      expect(addInvite).toHaveBeenCalledWith('1', '1', todayPlusWeek);
      expect(toast.success).toHaveBeenCalledWith('Applicant successfully invited.');
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.")
    });
  });
});
