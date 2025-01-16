import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import ApplicantPersonalPageContainer from '../../../src/containers/applicant-personal/ApplicantPersonalPageContainer';
import {getApplicant, getAssessment, getInvite} from '../../../src/utils/apiFunctions';
import {MemoryRouter, Route, Routes, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../../src/utils/types.tsx";
import {InviteStatuses} from "../../../src/utils/constants.tsx";

vi.mock('../../../src/utils/apiFunctions', () => ({
  getApplicant: vi.fn(),
  getInvite: vi.fn(),
  getAssessment: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  __esModule: true,
  toast: {
    error: vi.fn(),
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
vi.mocked(useNavigate).mockReturnValue(mockNavigate);

describe('ApplicantPersonalPageContainer', () => {
  const mockApplicant: ApplicantInterface = {
    createdAt: new Date(),
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    statuses: ['app_finished', 'app_finished'],
    preferredLanguage: 'Kotlin',
    scores: [90],
    invites: ['invite1', 'invite2'],
  };

  const mockInvites: InviteInterface[] = [
    {
      id: 'invite1', applicantId: '1', assessmentId: 'assessment1', status: InviteStatuses.APP_FINISHED, invitedAt: '', expiresAt: '',
      assessmentFinishedAt: new Date(),
      assessmentStartedAt: new Date(),
      measuredSecondsPerSection: [],
      scoredPoints: 0
    },
    {
      id: 'invite2', applicantId: '1', assessmentId: 'assessment2', status: InviteStatuses.APP_FINISHED, invitedAt: '', expiresAt: '',
      assessmentFinishedAt: new Date(),
      assessmentStartedAt: new Date(),
      measuredSecondsPerSection: [],
      scoredPoints: 0
    },
  ];

  const mockAssessments: AssessmentInterface[] = [
    {
      id: 'assessment1', tag: 'Assessment 1',
      sections: [0, 1]
    },
    {
      id: 'assessment2', tag: 'Assessment 2',
      sections: [0]
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch applicant data and render ApplicantPersonalPage', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[0]);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[1]);
    vi.mocked(getAssessment).mockResolvedValueOnce(mockAssessments[0]);
    vi.mocked(getAssessment).mockResolvedValueOnce(mockAssessments[1]);

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(getInvite).toHaveBeenCalledWith('invite1');
      expect(getInvite).toHaveBeenCalledWith('invite2');
      expect(getAssessment).toHaveBeenCalledWith('assessment1');
      expect(getAssessment).toHaveBeenCalledWith('assessment2');
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox', {name: 'Name:'})).toHaveValue('John Doe');
      expect(screen.getByText('Assessment 1:')).toBeInTheDocument();
      expect(screen.getByText('Assessment 2:')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully and navigate to /applicants', async () => {
    vi.mocked(getApplicant).mockRejectedValueOnce(new Error('Failed to fetch applicant data'));

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch applicant data');
    });
    expect(mockNavigate).toHaveBeenCalledWith("/applicants");
  });

  it('should show a loading page if data is incomplete (invite error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getInvite).mockRejectedValueOnce(new Error('Failed to fetch invite'));
    vi.mocked(getInvite).mockRejectedValueOnce(new Error('Failed to fetch invite'));

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(getInvite).toHaveBeenCalledTimes(2);
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch invite invite1:');
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch invite invite2:');
    });

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

  it('should show a loading page if data is incomplete (assessment error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[0]);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[1]);
    vi.mocked(getAssessment).mockRejectedValueOnce(new Error('Failed to fetch assessment'));

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(getInvite).toHaveBeenCalledWith('invite1');
      expect(getInvite).toHaveBeenCalledWith('invite2');
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch assessment');
    });

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

  it('should show a loading page if data is incomplete (assessment null as response error)', async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[0]);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[1]);
    vi.mocked(getAssessment).mockRejectedValueOnce(null);

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      expect(getApplicant).toHaveBeenCalledWith('1');
      expect(getInvite).toHaveBeenCalledWith('invite1');
      expect(getInvite).toHaveBeenCalledWith('invite2');
      expect(toast.error).toHaveBeenCalledWith("Unknown error occurred.");
    });

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

  it("navigates to /applicants when the button is clicked", async () => {
    vi.mocked(getApplicant).mockResolvedValueOnce(mockApplicant);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[0]);
    vi.mocked(getInvite).mockResolvedValueOnce(mockInvites[1]);
    vi.mocked(getAssessment).mockResolvedValueOnce(mockAssessments[0]);
    vi.mocked(getAssessment).mockResolvedValueOnce(mockAssessments[1]);

    render(
      <MemoryRouter initialEntries={['/applicants/1']}>
        <Routes>
          <Route path="/applicants/:id" element={<ApplicantPersonalPageContainer/>}/>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitFor(() => {
      const button = screen.getByRole("button", {name: 'Back to all applicants'});
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith("/applicants");
    });
  });
});
