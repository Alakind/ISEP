import {fireEvent, render, screen} from '@testing-library/react';
import SolvedAssignment from "../../../../src/components/applicant-personal/results/SolvedAssignment.tsx";
import {AssignmentSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes} from "../../../../src/utils/constants.tsx";

const mockAssignment: AssignmentSolvedInterface = {
  id: '1',
  type: AssignmentTypes.MULTIPLE_CHOICE,
  description: 'Solve the equation x + 2 = 5.',
  scoredPoints: 3,
  availablePoints: 5,
};

describe('SolvedAssignment Component', () => {
  const mockHandleScoreChange = vi.fn();
  const mockChildren = <div data-testid="child-component">Child Content</div>;

  it('renders the assignment header with description and score input', () => {
    render(
      <SolvedAssignment
        assignment={mockAssignment}
        index={0}
        handleScoreChange={mockHandleScoreChange}
        children={mockChildren}
      />
    );

    const header = screen.getByTestId('assignment-header');
    const description = screen.getByText(/1\. solve the equation x \+ 2 = 5\./i);
    const scoreInput = screen.getByRole('spinbutton');

    expect(header).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(scoreInput).toBeInTheDocument();
    expect(scoreInput).toHaveValue(3);
  });

  it('renders the children content inside the assignment block', () => {
    render(
      <SolvedAssignment
        assignment={mockAssignment}
        index={0}
        handleScoreChange={mockHandleScoreChange}
        children={mockChildren}
      />
    );

    const block = screen.getByTestId('assignment-block');
    const childComponent = screen.getByTestId('child-component');

    expect(block).toBeInTheDocument();
    expect(childComponent).toBeInTheDocument();
    expect(childComponent).toHaveTextContent('Child Content');
  });

  it('calls handleScoreChange when the score input value changes', () => {
    render(
      <SolvedAssignment
        assignment={mockAssignment}
        index={0}
        handleScoreChange={mockHandleScoreChange}
        children={mockChildren}
      />
    );

    const scoreInput = screen.getByRole('spinbutton');
    fireEvent.change(scoreInput, {target: {value: '4'}});

    expect(mockHandleScoreChange).toHaveBeenCalledWith(expect.anything(), '1', 5);
  });

  it('sets the score input min and max attributes correctly', () => {
    render(
      <SolvedAssignment
        assignment={mockAssignment}
        index={0}
        handleScoreChange={mockHandleScoreChange}
        children={mockChildren}
      />
    );

    const scoreInput = screen.getByRole('spinbutton');

    expect(scoreInput).toHaveAttribute('min', '0');
    expect(scoreInput).toHaveAttribute('max', '5');
  });

  it('handles missing scored points gracefully', () => {
    const assignmentWithoutScore = {
      ...mockAssignment,
      scoredPoints: null,
    };

    render(
      <SolvedAssignment
        assignment={assignmentWithoutScore}
        index={0}
        handleScoreChange={mockHandleScoreChange}
        children={mockChildren}
      />
    );

    const scoreInput = screen.getByRole('spinbutton');
    expect(scoreInput).toHaveValue(0);
  });
});