import {fireEvent, render, screen} from "@testing-library/react";
import TestResultBlock from "../../../../src/components/applicant-personal/results/TestResultBlock.tsx";
import {TestResultsInterface} from "../../../../src/utils/types.tsx";

const mockTestResults: TestResultsInterface[] = [
  {name: "Test 1", passed: true},
  {name: "Test 2", passed: false, message: "Failure"},
];

describe("TestResultBlock", () => {
  const defaultProps = {
    testResults: mockTestResults,
    showTestResults: false,
    handleShowTestResults: vi.fn(),
  };

  it("should render without crashing", () => {
    render(<TestResultBlock {...defaultProps} />);
    expect(screen.getByText(/Test results/i)).toBeInTheDocument();
  });

  it("should toggle and render test results when showTestResults is true", () => {
    render(<TestResultBlock {...defaultProps} showTestResults={true}/>);

    expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Failure/i)).toBeInTheDocument();
  });

  it("should not render test results when showTestResults is false", () => {
    render(<TestResultBlock {...defaultProps} showTestResults={false}/>);

    expect(screen.queryByText(/Test 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test 2/i)).not.toBeInTheDocument();
  });

  it("should call handleShowTestResults when the header button is clicked", () => {
    const handleShowTestResultsMock = vi.fn();
    render(
      <TestResultBlock
        {...defaultProps}
        handleShowTestResults={handleShowTestResultsMock}
      />
    );

    const button = screen.getByText(/Test results/i);
    fireEvent.click(button);
    expect(handleShowTestResultsMock).toHaveBeenCalledTimes(1);
  });

  it("should display the correct icon for passed and failed tests", () => {
    render(<TestResultBlock {...defaultProps} showTestResults={true}/>);

    const passedIcon = screen.getAllByText(/Test 1/i)[0].previousSibling?.firstChild;
    const failedIcon = screen.getAllByText(/Test 2/i)[0].previousSibling?.firstChild;
    
    expect(passedIcon).toHaveClass("bi-check-circle-fill");
    expect(failedIcon).toHaveClass("bi-x-circle-fill");
  });

  it("should display the message if provided", () => {
    render(<TestResultBlock {...defaultProps} showTestResults={true}/>);

    expect(screen.getByText(/: Failure/i)).toBeInTheDocument();
  });
});
