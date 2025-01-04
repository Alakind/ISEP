import {render, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import BarChartContainer from '../../../../../src/containers/applicant-personal/results/bar-chart/BarChartContainer';
import {getBarChartStats} from '../../../../../src/utils/apiFunctions';
import {toast} from 'react-toastify';
import {BarChartInterface} from '../../../../../src/utils/types';

vi.mock('../../../../../src/utils/apiFunctions', () => ({
  getBarChartStats: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('BarChartContainer', () => {
  const mockBarChartData: BarChartInterface = {
    percentage: '75%',
    barGroups: [
      {isSelected: true, value: "50"},
      {isSelected: false, value: "25"},
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display bar chart data', async () => {
    // Mock API response
    vi.mocked(getBarChartStats).mockResolvedValueOnce(mockBarChartData);

    render(<BarChartContainer inviteId="invite1"/>);

    // Verify loading state
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getBarChartStats).toHaveBeenCalledWith('invite1');
      expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    vi.mocked(getBarChartStats).mockRejectedValueOnce(new Error('Failed to fetch bar chart stats'));

    render(<BarChartContainer inviteId="invite1"/>);

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch bar chart stats');
    });

    // Verify no data is displayed
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    // Mock API failure
    vi.mocked(getBarChartStats).mockRejectedValueOnce(null);

    render(<BarChartContainer inviteId="invite1"/>);

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });

    // Verify no data is displayed
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('should not fetch data if inviteId is empty', () => {
    render(<BarChartContainer inviteId=""/>);

    // Ensure API is not called
    expect(getBarChartStats).not.toHaveBeenCalled();

    // Verify no data is displayed
    expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument();
  });

  it('should render a loading state while fetching data', async () => {
    vi.mocked(getBarChartStats).mockResolvedValueOnce(mockBarChartData);

    render(<BarChartContainer inviteId="invite1"/>);

    // Verify loading state
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-page')).not.toBeInTheDocument();
    });
  });
});
