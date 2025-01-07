import {render, screen, waitFor} from "@testing-library/react";
import AssessmentResultsOverview from "../../../../src/components/applicant-personal/results/AssessmentResultsOverview";
import {AssessmentInterface, ScoredAssessmentInterface} from "../../../../src/utils/types";

describe("AssessmentResultsOverview Component", () => {
  const mockAssessmentData: AssessmentInterface = {
    id: "1",
    tag: "JAVA Assessment",
    sections: [],
  };

  const mockAssessmentScore: ScoredAssessmentInterface = {
    scoredPoints: 80,
    availablePoints: 100,
  };

  const mockSetAssessmentScore = vi.fn();

  it("renders the score section with correct values", async () => {
    render(
      <AssessmentResultsOverview
        assessmentData={mockAssessmentData}
        inviteId="invite123"
        assessmentScore={mockAssessmentScore}
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    expect(screen.getByText("Score")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("80%")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    })
  });

  it("renders the comparison section", async () => {
    render(
      <AssessmentResultsOverview
        assessmentData={mockAssessmentData}
        inviteId="invite123"
        assessmentScore={mockAssessmentScore}
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    expect(screen.getByText("Comparison")).toBeInTheDocument();
    await waitFor(() => {
      const barChart = screen.getByTestId("bar-chart-container");
      expect(barChart).toBeInTheDocument();
    });
  });

  it("renders the skills section", async () => {
    render(
      <AssessmentResultsOverview
        assessmentData={mockAssessmentData}
        inviteId="invite123"
        assessmentScore={mockAssessmentScore}
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    expect(screen.getByText("Skills")).toBeInTheDocument();
    await waitFor(() => {
      const skillsContainer = screen.getByTestId("skills-container");
      expect(skillsContainer).toBeInTheDocument();
    });
  });

  it("renders the score section when scoredPoints is missing", async () => {
    const mockAssessmentScore: ScoredAssessmentInterface = {
      scoredPoints: null,
      availablePoints: 100,
    };
    render(
      <AssessmentResultsOverview
        assessmentData={mockAssessmentData}
        inviteId="invite123"
        assessmentScore={mockAssessmentScore}
        setAssessmentScore={mockSetAssessmentScore}
      />
    );

    expect(screen.getByText("Score")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    })
  });
});