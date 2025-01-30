import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import SolvedAssignmentCodingContainer from "../../../../src/containers/applicant-personal/results/SolvedAssignmentCodingContainer.tsx";
import {AssignmentTypes, Themes} from "../../../../src/utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../../src/utils/types.tsx";
import SolvedAssignmentCoding from "../../../../src/components/applicant-personal/results/SolvedAssignmentCoding.tsx";
import {act} from "react";


vi.mock("../../../../src/components/applicant-personal/results/SolvedAssignmentCoding.tsx", () => ({
  default: vi.fn(({handleShowCodeChanges, handleShowTestResults}) =>
    <div data-testid="solved-assignment-coding">
      <button onClick={() => handleShowCodeChanges()}>toggle code changes</button>
      <button onClick={() => handleShowTestResults()}>toggle test results</button>
    </div>
  ),
}));

describe("SolvedAssignmentCodingContainer", () => {
  const mockAssignment: AssignmentCodingSolvedInterface = {
    scoredPoints: null,
    id: "1",
    referenceAnswer: {code: "", type: AssignmentTypes.CODING, test: ""},
    answer: {code: "", type: AssignmentTypes.CODING, test: ""},
    testResults: [],
    startCode: "",
    type: AssignmentTypes.CODING,
    description: "",
    language: "Kotlin",
    availablePoints: 10,
    codeUri: "https://localhost:8081"
  };

  it("should render the SolvedAssignmentCoding component", () => {
    render(<SolvedAssignmentCodingContainer theme={Themes.LIGHT} assignment={mockAssignment}/>);
    const component = screen.getByTestId("solved-assignment-coding");
    expect(component).toBeInTheDocument();
  });

  it("should toggle showCodeChanges state on handleShowCodeChanges call", () => {
    render(<SolvedAssignmentCodingContainer theme={Themes.LIGHT} assignment={mockAssignment}/>);

    const toggleButton = screen.getByRole("button", {name: /toggle code changes/i});
    expect(toggleButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(SolvedAssignmentCoding).toHaveBeenCalledWith(
      expect.objectContaining({showCodeChanges: true}),
      expect.anything()
    );

    act(() => {
      fireEvent.click(toggleButton);
    })

    expect(SolvedAssignmentCoding).toHaveBeenCalledWith(
      expect.objectContaining({showCodeChanges: false}),
      expect.anything()
    );
  });

  it("should toggle showTestResults state on handleShowTestResults call", () => {
    render(<SolvedAssignmentCodingContainer theme={Themes.LIGHT} assignment={mockAssignment}/>);

    const toggleButton = screen.getByRole("button", {name: /toggle test results/i});
    expect(toggleButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(toggleButton);
    })
    expect(SolvedAssignmentCoding).toHaveBeenCalledWith(
      expect.objectContaining({showTestResults: false}),
      expect.anything()
    );

    act(() => {
      fireEvent.click(toggleButton);
    })
    expect(SolvedAssignmentCoding).toHaveBeenCalledWith(
      expect.objectContaining({showTestResults: true}),
      expect.anything()
    );
  });
});