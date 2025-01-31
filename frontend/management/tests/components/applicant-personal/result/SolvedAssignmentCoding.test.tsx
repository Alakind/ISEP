import {fireEvent, render, screen} from '@testing-library/react';
import SolvedAssignmentCoding from "../../../../src/components/applicant-personal/results/SolvedAssignmentCoding.tsx";
import {AssignmentCodingSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes, Themes} from "../../../../src/utils/constants.tsx";

vi.mock("react-diff-viewer-continued", () => ({
  default: vi.fn(() => <div data-testid="diff-viewer">Mocked Diff Viewer</div>),
  DiffMethod: {CHARS: "chars"},
}));

describe('SolvedAssignmentCoding Component', () => {
  const mockAssignment: AssignmentCodingSolvedInterface = {
    id: '1',
    type: AssignmentTypes.CODING,
    description: "How do you improve this code?",
    scoredPoints: 5,
    availablePoints: 10,
    codeUri: "a1b2c3d4e5f6g7h8i9j0",
    language: "javascript",
    answer: {type: AssignmentTypes.CODING, code: 'console.log("Hello, World!");', test: ""},
    referenceAnswer: {type: AssignmentTypes.CODING, code: 'console.log("Expected Output");', test: ""},
    testResults: [{name: "null test", passed: true}],
    startCode: "console.log(\"Hello!\");",
  };

  const defaultProps = {
    theme: Themes.LIGHT,
    assignment: mockAssignment,
    handleShowCodeChanges: vi.fn(),
    showCodeChanges: false,
    showTestResults: false,
    handleShowTestResults: vi.fn(),
    showTestCode: false,
    handleShowTestCode: vi.fn(),
    showReferenceCode: false,
    handleShowReferenceCode: vi.fn(),
    showReferenceTestCode: false,
    handleShowReferenceTestCode: vi.fn(),
  };

  it("should render without crashing", () => {
    render(<SolvedAssignmentCoding {...defaultProps} />);
    expect(screen.getByText("Code changes", {exact: true})).toBeInTheDocument();
  });

  it("should display 'No changes are made' if startCode and answer are the same", () => {
    const props = {
      ...defaultProps,
      showCodeChanges: true,
      assignment: {
        ...defaultProps.assignment,
        startCode: "console.log('Code');",
        answer: {
          type: AssignmentTypes.CODING,
          code: "console.log('Code');",
          test: ""
        }
      },
    };
    render(<SolvedAssignmentCoding {...props} />);
    expect(screen.getByText(/No changes are made to the original code/i)).toBeInTheDocument();
  });

  it("should toggle and render the diff viewer on clicking 'Code changes' button", () => {
    render(<SolvedAssignmentCoding {...defaultProps} showCodeChanges={true}/>);

    expect(screen.getByTestId("diff-viewer")).toBeInTheDocument();
  });

  it("should not render diff viewer if 'showCodeChanges' is false", () => {
    render(<SolvedAssignmentCoding {...defaultProps} />);

    expect(screen.queryByTestId("diff-viewer")).not.toBeInTheDocument();
  });

  it("should render 'No test results available' when there are no test results", () => {
    const props = {
      ...defaultProps,
      showTestResults: true,
      assignment: {...mockAssignment, testResults: []},
    };
    render(<SolvedAssignmentCoding {...props} />);
    expect(screen.getByText(/No test results available/i)).toBeInTheDocument();
  });

  it("should render TestResultBlock when test results are present", () => {
    render(<SolvedAssignmentCoding {...defaultProps} />);
    expect(screen.getByText(/Test Results/i)).toBeInTheDocument();
  });

  it("should call handleShowCodeChanges when 'Code changes' button is clicked", () => {
    const handleShowCodeChangesMock = vi.fn();
    render(
      <SolvedAssignmentCoding
        {...defaultProps}
        handleShowCodeChanges={handleShowCodeChangesMock}
      />
    );

    fireEvent.click(screen.getByText("Code changes", {exact: true}));
    expect(handleShowCodeChangesMock).toHaveBeenCalledTimes(1);
  });

  it("should call handleShowTestResults when 'Test Results' are toggled", () => {
    const handleShowTestResultsMock = vi.fn();
    render(
      <SolvedAssignmentCoding
        {...defaultProps}
        handleShowTestResults={handleShowTestResultsMock}
      />
    );

    fireEvent.click(screen.getByText(/Test results/i));
    expect(handleShowTestResultsMock).toHaveBeenCalledTimes(1);
  });
});
