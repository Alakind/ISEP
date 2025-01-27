import {render, screen, waitFor} from '@testing-library/react';
import AssessmentResultsViewerContainer from '../../../../src/containers/applicant-personal/results/AssessmentResultsViewerContainer';
import {getSectionResult} from '../../../../src/utils/apiFunctions';
import {toast} from 'react-toastify';
import {AssessmentInterface, InviteInterface, SectionSolvedInterface} from '../../../../src/utils/types';
import {scrollToAssignment} from "../../../../src/utils/general.tsx";

vi.mock('../../../../src/utils/apiFunctions', () => ({
  getSectionResult: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('../../../../src/utils/general.tsx', () => ({
  scrollToAssignment: vi.fn(),
}))

describe('AssessmentResultsViewerContainer', () => {
  const mockInvitesData: InviteInterface[] = [
    {
      id: "cce487c0-9ff7-47a8-9844-b406e046459b",
      applicantId: "90",
      assessmentId: "1",
      status: "not_started",
      invitedAt: "2024-12-30T00:28:25.485108Z",
      expiresAt: "2025-01-06T00:28:25.485108Z",
      measuredSecondsPerSection: []
    },
    {
      id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
      applicantId: "90",
      assessmentId: "2",
      status: "app_finished",
      invitedAt: "2024-12-30T00:28:25.485638Z",
      expiresAt: "2025-01-06T00:28:25.485638Z",
      measuredSecondsPerSection: []
    }
  ];

  const mockAssessmentsData: AssessmentInterface[] = [
    {id: '1', tag: 'Assessment 1', sections: [1, 2]},
    {id: '2', tag: 'Assessment 2', sections: [3, 4]},
  ];

  const mockSectionsData: SectionSolvedInterface[][] = [
    [
      {
        id: '1',
        title: 'Section 1',
        assignments: [],
        scoredPoints: null,
        availablePoints: 0,
        size: 0
      },
      {
        id: '2',
        title: 'Section 2',
        assignments: [],
        scoredPoints: null,
        availablePoints: 0,
        size: 0
      },
    ],
    [
      {
        id: '3',
        title: 'Section 3',
        assignments: [],
        scoredPoints: null,
        availablePoints: 0,
        size: 0
      },
      {
        id: '4',
        title: 'Section 4',
        assignments: [],
        scoredPoints: null,
        availablePoints: 0,
        size: 0
      },
    ],
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and render section results', async () => {
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[0][0])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[0][1])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[1][0])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[1][1])

    render(
      <AssessmentResultsViewerContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
      />
    );

    // Ensure loading state is displayed initially
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(scrollToAssignment).toHaveBeenCalledTimes(1);
      expect(getSectionResult).toHaveBeenCalledTimes(4);
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
      expect(screen.getByText('Assessment 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
      expect(screen.getByText('Section 4')).toBeInTheDocument();
    });
    vi.mocked(scrollToAssignment).mockClear()
  });

  it('should scroll to active assessment and show active assessments (finished invite status)', async () => {
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[0][0])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[0][1])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[1][0])
    vi.mocked(getSectionResult).mockResolvedValueOnce(mockSectionsData[1][1])
    vi.mocked(scrollToAssignment).mockClear()

    render(
      <AssessmentResultsViewerContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
      />
    );

    // Ensure loading state is displayed initially
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(scrollToAssignment).toHaveBeenCalledTimes(1);

      const activeButton = screen.getByRole('button', {name: `Assessment 2`});
      expect(activeButton).toBeInTheDocument();
      expect(activeButton).toHaveClass("results__container__assessment-select--active");

      const nonActiveButton = screen.getByRole('button', {name: `Assessment 1`});
      expect(nonActiveButton).toBeInTheDocument();
      expect(nonActiveButton).toHaveClass("results__container__assessment-select--disabled")
    });
  });

  it('should handle errors gracefully when fetching section results fails', async () => {
    // Mock API failure
    vi.mocked(getSectionResult).mockRejectedValueOnce(new Error('Failed to fetch section results'));

    render(
      <AssessmentResultsViewerContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
      />
    );

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch section results');
    });

    // Verify no sections are rendered
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
  });

  it('should handle errors gracefully when fetching section results fails (unknown error)', async () => {
    // Mock API failure
    vi.mocked(getSectionResult).mockRejectedValueOnce(null);

    render(
      <AssessmentResultsViewerContainer
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
      />
    );

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });

    // Verify no sections are rendered
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
  });

  it('should render nothing if data is not provided', () => {
    render(<AssessmentResultsViewerContainer invitesData={[]} assessmentsData={[]}/>);

    // Ensure nothing is rendered
    expect(screen.queryByText('Assessment 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
  });
});
