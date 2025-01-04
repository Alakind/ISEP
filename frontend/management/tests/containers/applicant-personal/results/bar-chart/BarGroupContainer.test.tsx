import {render, screen} from "@testing-library/react";
import BarGroupContainer from "../../../../../src/containers/applicant-personal/results/bar-chart/BarGroupContainer";

describe('BarGroupContainer', () => {
  it('should render the BarGroup component ', () => {
    render(<BarGroupContainer barGroupData={{value: "0", isSelected: true}} barWidth={0}/>)

    const element = screen.getByTestId("bar-group");
    expect(element).toBeInTheDocument();
  });
})