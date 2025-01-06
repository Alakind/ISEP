import {render, screen} from '@testing-library/react';
import SolvedAssignmentOpen from "../../../../src/components/applicant-personal/results/SolvedAssignmentOpen.tsx";
import {AssignmentOpenSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes} from "../../../../src/utils/constants.tsx";

describe('SolvedAssignmentOpen Component', () => {
  const mockAssignment: AssignmentOpenSolvedInterface = {
    id: '1',
    type: AssignmentTypes.OPEN,
    description: "What is the question?",
    scoredPoints: 5,
    availablePoints: 10,
    answer: {type: AssignmentTypes.OPEN, answer: 'This is the provided answer.'},
    referenceAnswer: {type: AssignmentTypes.OPEN, answer: 'This is the reference answer.'},
  };

  it('renders the provided answer correctly', () => {
    render(<SolvedAssignmentOpen assignment={mockAssignment}/>);

    const answerTextarea = screen.getByPlaceholderText(/no answer provided/i);
    expect(answerTextarea).toBeInTheDocument();
    expect(answerTextarea).toHaveValue(mockAssignment.answer.answer);
    expect(answerTextarea).toHaveAttribute('readonly');
  });

  it('renders the reference answer correctly', () => {
    render(<SolvedAssignmentOpen assignment={mockAssignment}/>);

    const referenceTextarea = screen.getByPlaceholderText(/no reference answer available/i);
    expect(referenceTextarea).toBeInTheDocument();
    expect(referenceTextarea).toHaveValue(mockAssignment.referenceAnswer.answer);
    expect(referenceTextarea).toHaveAttribute('readonly');
  });

  it('displays placeholder when no provided answer is available', () => {
    const assignmentWithoutAnswer = {
      ...mockAssignment,
      answer: {type: AssignmentTypes.OPEN, answer: ''},
    };

    render(<SolvedAssignmentOpen assignment={assignmentWithoutAnswer}/>);

    const answerTextarea = screen.getByPlaceholderText(/no answer provided/i);
    expect(answerTextarea).toHaveValue('');
  });

  it('displays placeholder when no reference answer is available', () => {
    const assignmentWithoutReference = {
      ...mockAssignment,
      referenceAnswer: {type: AssignmentTypes.OPEN, answer: ''},
    };

    render(<SolvedAssignmentOpen assignment={assignmentWithoutReference}/>);

    const referenceTextarea = screen.getByPlaceholderText(/no reference answer available/i);
    expect(referenceTextarea).toHaveValue('');
  });
});