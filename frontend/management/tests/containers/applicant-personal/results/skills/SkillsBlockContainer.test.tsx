import {render, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import SkillsBlockContainer from '../../../../../src/containers/applicant-personal/results/skills/SkillsBlockContainer';
import {getSkillsStats} from '../../../../../src/utils/apiFunctions';
import {toast} from 'react-toastify';
import {SkillsInterface} from '../../../../../src/utils/types';

vi.mock('../../../../../src/utils/apiFunctions', () => ({
  getSkillsStats: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('SkillsBlockContainer', () => {
  const mockSetAssessmentScore = vi.fn();
  const mockSkillsData: SkillsInterface[] = [
    {title: 'Skill 1', scoredPoints: 5, availablePoints: 10},
    {title: 'Skill 2', scoredPoints: 8, availablePoints: 15},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display skills data', async () => {
    // Mock API response
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillsData);

    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId="invite1"
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Verify loading state
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getSkillsStats).toHaveBeenCalledWith('assessment1', 'invite1');
      expect(screen.getByTestId('skills-container')).toBeInTheDocument();
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 2')).toBeInTheDocument();
    });

    // Verify setAssessmentScore was called with correct values
    expect(mockSetAssessmentScore).toHaveBeenCalledWith({
      availablePoints: 25,
      scoredPoints: 13,
    });
  });

  it('should fetch and display skills data when scoredPoint is null', async () => {
    // Mock API response
    const mockSkillsData: SkillsInterface[] = [
      {title: 'Skill 1', scoredPoints: null, availablePoints: 10},
      {title: 'Skill 2', scoredPoints: 8, availablePoints: 10},
    ];
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillsData);

    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId="invite1"
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Verify loading state
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getSkillsStats).toHaveBeenCalledWith('assessment1', 'invite1');
      expect(screen.getByTestId('skills-container')).toBeInTheDocument();
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('0 / 10')).toBeInTheDocument();
      expect(screen.getByText('Skill 2')).toBeInTheDocument();
      expect(screen.getByText('8 / 10')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    vi.mocked(getSkillsStats).mockRejectedValueOnce(new Error('Failed to fetch skills stats'));

    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId="invite1"
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch skills stats');
    });

    // Verify no data is displayed
    expect(screen.queryByTestId('skills-row')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    // Mock API failure
    vi.mocked(getSkillsStats).mockRejectedValueOnce(null);

    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId="invite1"
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });

    // Verify no data is displayed
    expect(screen.queryByTestId('skills-row')).not.toBeInTheDocument();
  });

  it('should not fetch data if inviteId is empty', () => {
    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId=""
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Ensure API is not called
    expect(getSkillsStats).not.toHaveBeenCalled();

    // Ensure no data is displayed
    expect(screen.queryByTestId('skills-row')).not.toBeInTheDocument();
  });

  it('should render a loading state while fetching data', async () => {
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillsData);

    render(
      <SkillsBlockContainer
        assessmentId="assessment1"
        inviteId="invite1"
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    // Verify loading state
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument();
    });
  });
});
