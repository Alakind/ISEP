import {render, screen} from '@testing-library/react';
import SolvedAssignmentCoding from "../../../../src/components/applicant-personal/results/SolvedAssignmentCoding.tsx";
import {AssignmentCodingSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes} from "../../../../src/utils/constants.tsx";

describe('SolvedAssignmentCoding Component', () => {
  const mockAssignment: AssignmentCodingSolvedInterface = {
    id: '1',
    type: AssignmentTypes.CODING,
    description: "How do you improve this code?",
    scoredPoints: 5,
    availablePoints: 10,
    codeUri: "a1b2c3d4e5f6g7h8i9j0",
    language: "javascript",
    answer: {type: AssignmentTypes.CODING, answer: 'console.log("Hello, World!");'},
    referenceAnswer: {type: AssignmentTypes.CODING, answer: 'console.log("Expected Output");'},
    testResults: [{name: "null test", passed: true}]
  };

  it('renders the assignment', () => {
    render(<SolvedAssignmentCoding assignment={mockAssignment}/>);

    const textElement = screen.getByText(/Original code has been changed/i);
    expect(textElement).toBeInTheDocument();
  });
});
