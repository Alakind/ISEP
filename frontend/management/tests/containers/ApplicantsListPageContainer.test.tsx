import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ApplicantsListPageContainer from '../../src/containers/ApplicantsListPageContainer';
import {getApplicants, getInvites} from '../../src/utils/apiFunctions.tsx';
import {toast} from 'react-toastify';
import {ApplicantInterface, InviteInterface} from '../../src/utils/types';
import {MemoryRouter, useNavigate} from "react-router-dom";
import {vi} from "vitest";
import {act} from "react";

vi.mock('../../src/utils/apiFunctions.tsx', () => ({
  __esModule: true,
  getApplicants: vi.fn(),
  getInvites: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  __esModule: true,
  toast: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('ApplicantsListPageContainer', () => {
  const mockApplicants: ApplicantInterface[] = [
    {
      createdAt: new Date(), id: '1', name: 'John Doe', email: 'john@example.com',
      preferredLanguage: 'Kotlin', invites: ['invite1', 'invite2'],
      scores: [10]
    },
    {
      createdAt: new Date(), id: '2', name: 'Jane Doe', email: 'jane@example.com',
      preferredLanguage: 'Kotlin', invites: ['invite1', 'invite2'],
      scores: [10]
    },
  ];

  const mockInvitesData: InviteInterface[] = [
    {
      id: "invite1",
      applicantId: "90",
      assessmentId: "3",
      status: "not_started",
      invitedAt: "2024-12-30T00:28:25.485108Z",
      expiresAt: "2025-01-06T00:28:25.485108Z",
      assessmentFinishedAt: "",
      assessmentStartedAt: "",
      measuredSecondsPerSection: [],
      scoredPoints: 0
    },
    {
      id: "invite2",
      applicantId: "90",
      assessmentId: "4",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-06T00:28:25.485638Z",
      assessmentFinishedAt: "",
      assessmentStartedAt: "",
      measuredSecondsPerSection: [],
      scoredPoints: 0
    }
  ];


  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and render applicant data', async () => {
    vi.mocked(getApplicants).mockResolvedValueOnce({
      data: mockApplicants,
      totalItems: 2,
    });
    vi.mocked(getInvites).mockResolvedValueOnce({data: mockInvitesData, totalItems: 2});

    render(<MemoryRouter><ApplicantsListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    expect(getApplicants).toHaveBeenCalledWith(0, 10, 'name,asc', '');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(getApplicants).mockRejectedValueOnce(new Error('Failed to fetch Applicants'));

    render(<MemoryRouter><ApplicantsListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch Applicants');
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    vi.mocked(getApplicants).mockRejectedValueOnce(null);

    render(<MemoryRouter><ApplicantsListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should update query and fetch data when setQuery is called', async () => {
    vi.mocked(getApplicants).mockResolvedValueOnce({
      data: mockApplicants,
      totalItems: 2,
    });
    vi.mocked(getInvites).mockResolvedValueOnce({data: mockInvitesData, totalItems: 2});

    render(<MemoryRouter><ApplicantsListPageContainer/></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', {name: /search/i});
    fireEvent.change(searchInput, {target: {value: 'Jane'}});

    await waitFor(() => {
      expect(getApplicants).toHaveBeenCalledWith(0, 10, 'name,asc', 'name=Jane');
    });
  });

  it("navigates to /applicants/add when the button is clicked", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ApplicantsListPageContainer/>
      </MemoryRouter>
    );

    const button = screen.getByRole('button', {name: "Add applicant"});
    await act(async () => {
      fireEvent.click(button);
    })

    expect(mockNavigate).toHaveBeenCalledWith("/applicants/add");
  });
});
