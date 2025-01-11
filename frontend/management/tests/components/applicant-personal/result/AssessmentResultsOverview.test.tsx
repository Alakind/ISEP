import {render, screen, waitFor} from "@testing-library/react";
import AssessmentResultsOverview from "../../../../src/components/applicant-personal/results/AssessmentResultsOverview";
import {AssessmentInterface, ScoredAssessmentInterface, SkillsInterface} from "../../../../src/utils/types";
import {getSkillsStats} from "../../../../src/utils/apiFunctions.tsx";
import {vi} from "vitest";

vi.mock('../../../../src/utils/apiFunctions', () => ({
  getSkillsStats: vi.fn(),
}));

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

  const mockSkillStats: SkillsInterface[] = [
    {
      availablePoints: 10, scoredPoints: 3, title: "test1"
    },
    {
      availablePoints: 10, scoredPoints: 5, title: "test2"
    }
  ]

  const mockSetAssessmentScore = vi.fn();

  it("renders the score section with correct values", async () => {
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillStats);
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
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillStats);
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
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillStats);

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
    vi.mocked(getSkillsStats).mockResolvedValueOnce(mockSkillStats);
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