import {render, screen} from '@testing-library/react';
import SolvedAssignmentMultipleChoice from "../../../../src/components/applicant-personal/results/SolvedAssignmentMultipleChoice.tsx";
import {AssignmentMultipleChoiceSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes} from "../../../../src/utils/constants.tsx";

describe('SolvedAssignmentMultipleChoice Component', () => {
  const mockAssignment: AssignmentMultipleChoiceSolvedInterface = {
    id: '1',
    type: AssignmentTypes.MULTIPLE_CHOICE,
    description: "How many options are there?",
    scoredPoints: 2,
    availablePoints: 3,
    options: ['Option 1', 'Option 2', 'Option 3'],
    answer: {type: AssignmentTypes.MULTIPLE_CHOICE, answer: [0, 1]},
    referenceAnswer: {type: AssignmentTypes.MULTIPLE_CHOICE, answer: [1, 2]},
    isMultipleAnswers: true,
  };

  it('renders all options', () => {
    render(<SolvedAssignmentMultipleChoice assignment={mockAssignment}/>);

    const optionLabels = screen.getAllByRole('checkbox');
    expect(optionLabels).toHaveLength(mockAssignment.options.length);

    mockAssignment.options.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it('marks correct answers with correct styling', () => {
    render(<SolvedAssignmentMultipleChoice assignment={mockAssignment}/>);

    const correctOption = screen.getByLabelText('Option 2');
    expect(correctOption).toHaveClass('assignment__input--correct');
  });

  it('marks wrong answers with wrong styling', () => {
    render(<SolvedAssignmentMultipleChoice assignment={mockAssignment}/>);

    const wrongOption = screen.getByLabelText('Option 1');
    expect(wrongOption).toHaveClass('assignment__input--wrong');
  });

  it('disables all inputs', () => {
    render(<SolvedAssignmentMultipleChoice assignment={mockAssignment}/>);

    const inputs = screen.getAllByRole('checkbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('renders solution markers for correct answers', () => {
    render(<SolvedAssignmentMultipleChoice assignment={mockAssignment}/>);

    const solutionMarker = screen.getAllByText('(solution)');
    expect(solutionMarker).toHaveLength(mockAssignment.referenceAnswer.answer.length);
  });

  it('renders with radio inputs for single-answer assignments', () => {
    const singleAnswerAssignment = {
      ...mockAssignment,
      isMultipleAnswers: false,
    };

    render(<SolvedAssignmentMultipleChoice assignment={singleAnswerAssignment}/>);

    const inputs = screen.getAllByRole('radio');
    expect(inputs).toHaveLength(singleAnswerAssignment.options.length);
  });
});