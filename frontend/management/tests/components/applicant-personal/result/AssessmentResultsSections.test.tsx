import {fireEvent, render, screen} from "@testing-library/react";
import AssessmentResultsSections from "../../../../src/components/applicant-personal/results/AssessmentResultsSections";
import {AssignmentTypes} from "../../../../src/utils/constants";
import {AssignmentCodingSolvedInterface, AssignmentMultipleChoiceSolvedInterface, AssignmentOpenSolvedInterface, SectionSolvedInterface} from "../../../../src/utils/types.tsx";
import {expect} from "vitest";

describe("AssessmentResultsSections Component", () => {
  const mockSetActiveSection = vi.fn();

  const assignment1: AssignmentMultipleChoiceSolvedInterface = {
    id: "assignment1",
    type: AssignmentTypes.MULTIPLE_CHOICE,
    description: "Question 1",
    availablePoints: 5,
    scoredPoints: 4,
    options: ["A", "B", "C"],
    isMultipleAnswers: false,
    answer: {type: AssignmentTypes.MULTIPLE_CHOICE, answer: [0]},
    referenceAnswer: {type: AssignmentTypes.MULTIPLE_CHOICE, answer: [0]},
  }

  const assignment2: AssignmentOpenSolvedInterface = {
    id: "assignment2",
    type: AssignmentTypes.OPEN,
    description: "Write an essay",
    availablePoints: 5,
    scoredPoints: 4,
    answer: {type: AssignmentTypes.OPEN, answer: "this is an essay"},
    referenceAnswer: {type: AssignmentTypes.OPEN, answer: "many words"},
  }

  const assignment3: AssignmentCodingSolvedInterface = {
    id: "assignment3",
    type: AssignmentTypes.CODING,
    description: "Write a function",
    availablePoints: 10,
    scoredPoints: 6,
    codeUri: "afadfadf",
    language: "Kotlin",
    answer: {type: AssignmentTypes.CODING, answer: "function code"},
    referenceAnswer: {type: AssignmentTypes.CODING, answer: "Reference code"},
  }

  const mockSections: SectionSolvedInterface[] = [
    {
      id: "section1",
      title: "Section 1",
      scoredPoints: 8,
      availablePoints: 10,
      measuredTime: "10 min",
      suggestedTime: "15 min",
      assignments: [
        assignment1,
        assignment2
      ],
      size: 2
    },
    {
      id: "section2",
      title: "Section 2",
      scoredPoints: 6,
      availablePoints: 10,
      assignments: [
        assignment3
      ],
      size: 1
    },
  ];


  it("renders all sections correctly", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
      />
    );

    const sectionHeaders = screen.getAllByTestId("section-header");
    expect(sectionHeaders).toHaveLength(mockSections.length);

    mockSections.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
      expect(screen.getByText(`${section.scoredPoints} / ${section.availablePoints}`)).toBeInTheDocument();
      expect(screen.getByText(`${(((section.scoredPoints ?? 0) / section.availablePoints) * 100).toFixed(2)} %`)).toBeInTheDocument();
    });
  });

  it("renders placeholder when measured time and/or suggested time are not provided", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
      />
    );

    mockSections.forEach((section) => {
      if (!section.measuredTime) {
        expect(screen.getByText("No measured time")).toBeInTheDocument();
      }

      if (!section.suggestedTime) {
        expect(screen.getByText("Suggested: - min.")).toBeInTheDocument();
      }
    });
  });

  it("calls setActiveSection when a section header is clicked", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
      />
    );

    const sectionHeaders = screen.getAllByRole("button");
    fireEvent.click(sectionHeaders[1]);

    expect(mockSetActiveSection).toHaveBeenCalledWith(1);
  });

  it("renders multiple-choice assignments correctly", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
      />
    );

    expect(screen.getByText("1. Question 1")).toBeInTheDocument();
    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(3);
  });

  it("renders open assignments correctly", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={0}
        setActiveSection={mockSetActiveSection}
      />
    );

    expect(screen.getByText("2. Write an essay")).toBeInTheDocument();
    const answerTextArea = screen.getByTestId("open-answer");
    expect(answerTextArea).toBeInTheDocument();
    expect(answerTextArea).toHaveTextContent(/this is an essay/i)

    const referenceAnswerTextArea = screen.getByTestId("open-reference-answer");
    expect(referenceAnswerTextArea).toBeInTheDocument();
    expect(referenceAnswerTextArea).toHaveTextContent(/many words/i)
  });

  it("renders coding assignments correctly", () => {
    render(
      <AssessmentResultsSections
        inviteUuid="invite123"
        sections={mockSections}
        activeSection={1}
        setActiveSection={mockSetActiveSection}
      />
    );

    expect(screen.getByText("1. Write a function")).toBeInTheDocument();
    //TODO more testing when fully implemented
  });
});