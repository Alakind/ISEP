import {render, screen} from "@testing-library/react";
import AssessmentResultsOverviewContainer from "../../../../src/containers/applicant-personal/results/AssessmentResultsOverviewContainer";

describe('AssessmentResultsOverviewContainer', () => {
  it('should render the AssessmentResultsOverview component ', () => {
    render(<AssessmentResultsOverviewContainer assessmentData={{id: "0", tag: "tag", sections: []}} inviteId={""}/>)

    const element = screen.getByTestId("assessment-results-overview");
    expect(element).toBeInTheDocument();
  });
})