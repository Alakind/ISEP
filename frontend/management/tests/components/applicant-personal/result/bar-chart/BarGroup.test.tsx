import {render, screen} from '@testing-library/react';
import BarGroup from "../../../../../src/components/applicant-personal/results/bar-chart/BarGroup.tsx";


describe('BarGroup Component', () => {
  const mockProps = {
    barWidth: 50,
    barPadding: 10,
    barColour: 'blue',
    height: 75,
  };

  it('renders a rect with correct attributes', () => {
    render(
      <svg>
        <BarGroup {...mockProps} />
      </svg>
    );

    const rect = screen.getByTestId('bar-group');
    expect(rect).toBeInTheDocument();

    expect(rect).toHaveAttribute('y', '25%');
    expect(rect).toHaveAttribute('height', '75%');
    expect(rect).toHaveAttribute('width', '40');
    expect(rect).toHaveAttribute('fill', 'blue');
  });
});