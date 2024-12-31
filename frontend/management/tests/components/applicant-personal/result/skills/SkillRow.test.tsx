import {render, screen} from "@testing-library/react";
import SkillRow from "../../../../../src/components/applicant-personal/results/skills/SkillRow.tsx";
import {SkillsInterface} from "../../../../../src/utils/types.tsx";

describe('SkillRow component', () => {
  const mockSkillData: SkillsInterface = {
    title: 'JavaScript',
    scoredPoints: 75,
    availablePoints: 100,
  };

  it('renders skill title', () => {
    render(<SkillRow skillData={mockSkillData}/>);

    const titleCell = screen.getByText(/javascript/i);
    expect(titleCell).toBeInTheDocument();
  });

  it('renders correct percentage', () => {
    render(<SkillRow skillData={mockSkillData}/>);

    const percentageCell = screen.getByText(/75 %/i);
    expect(percentageCell).toBeInTheDocument();
  });

  it('renders correct points display', () => {
    render(<SkillRow skillData={mockSkillData}/>);

    const pointsCell = screen.getByText(/75 \/ 100/i);
    expect(pointsCell).toBeInTheDocument();
  });

  it('renders progress bar with correct values', () => {
    render(<SkillRow skillData={mockSkillData}/>);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('value', '75');
    expect(progressBar).toHaveAttribute('max', '100');
  });

  it('handles zero scored points correctly', () => {
    const skillDataWithZeroPoints = {
      title: 'HTML',
      scoredPoints: 0,
      availablePoints: 100,
    };

    render(<SkillRow skillData={skillDataWithZeroPoints}/>);

    const percentageCell = screen.getByText(/0 %/i);
    expect(percentageCell).toBeInTheDocument();

    const pointsCell = screen.getByText(/0 \/ 100/i);
    expect(pointsCell).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('value', '0');
    expect(progressBar).toHaveAttribute('max', '100');
  });

  it('handles missing scored points gracefully', () => {
    const skillDataWithNullPoints = {
      title: 'CSS',
      scoredPoints: null,
      availablePoints: 100,
    };

    render(<SkillRow skillData={skillDataWithNullPoints}/>);

    const percentageCell = screen.getByText(/0 %/i);
    expect(percentageCell).toBeInTheDocument();

    const pointsCell = screen.getByText(/0 \/ 100/i);
    expect(pointsCell).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('value', '0');
    expect(progressBar).toHaveAttribute('max', '100');
  });
})