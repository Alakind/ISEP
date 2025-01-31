import BarChart from "../../../../../src/components/applicant-personal/results/bar-chart/BarChart.tsx";
import {render, screen} from "@testing-library/react";
import {BarChartInterface} from "../../../../../src/utils/types.tsx";

const mockBarChartData: BarChartInterface = {
  percentage: 46.17,
  distributionGroups: [1, 4, 14, 24, 31, 14, 9, 1, 1, 1],
  selectedGroup: 4
};

describe('BarChart Component', () => {
  const barWidth = 20;

  it('renders the bar chart container', () => {
    render(<BarChart barChartData={mockBarChartData} barWidth={barWidth}/>);

    const container = screen.getByTestId('bar-chart-container');
    expect(container).toBeInTheDocument();
  });

  it('renders the correct number of bar groups', () => {
    render(<BarChart barChartData={mockBarChartData} barWidth={barWidth}/>);

    const barGroups = screen.getAllByTestId('bar-group');
    expect(barGroups).toHaveLength(mockBarChartData.distributionGroups.length);
  });

  it('passes correct data to BarGroupContainer', () => {
    render(<BarChart barChartData={mockBarChartData} barWidth={barWidth}/>);

    const barGroups = screen.getAllByTestId('bar-group');
    barGroups.forEach((barGroup, index) => {
      expect(barGroup).toHaveAttribute(
        'height',
        JSON.stringify(Number(mockBarChartData.distributionGroups[index]) * 2) + "%"
      );
      expect(barGroup).toHaveAttribute('width', `${barWidth - 2}`);
    });
  });

  it('displays the percentage text correctly', () => {
    render(<BarChart barChartData={mockBarChartData} barWidth={barWidth}/>);

    const percentageText = screen.getByText(/better than/i);
    expect(percentageText).toHaveTextContent(`Better than ${mockBarChartData.percentage}% of other applicants`);
  });
});