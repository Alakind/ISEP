import BarChart from "../../../../../src/components/applicant-personal/results/bar-chart/BarChart.tsx";
import {render, screen} from "@testing-library/react";
import {BarChartInterface} from "../../../../../src/utils/types.tsx";

const mockBarChartData: BarChartInterface = {
  percentage: "46.17",
  barGroups: [
    {
      value: "1",
      isSelected: false,
    },
    {
      value: "4",
      isSelected: false,
    },
    {
      value: "14",
      isSelected: false,
    },
    {
      value: "24",
      isSelected: false,
    },
    {
      value: "31",
      isSelected: true,
    },
    {
      value: "14",
      isSelected: false,
    },
    {
      value: "9",
      isSelected: false,
    },
    {
      value: "1",
      isSelected: false,
    },
    {
      value: "1",
      isSelected: false,
    },
    {
      value: "1",
      isSelected: false,
    },
  ]
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
    expect(barGroups).toHaveLength(mockBarChartData.barGroups.length);
  });

  it('passes correct data to BarGroupContainer', () => {
    render(<BarChart barChartData={mockBarChartData} barWidth={barWidth}/>);

    const barGroups = screen.getAllByTestId('bar-group');
    barGroups.forEach((barGroup, index) => {
      expect(barGroup).toHaveAttribute(
        'height',
        JSON.stringify(Number(mockBarChartData.barGroups[index].value) * 2) + "%"
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