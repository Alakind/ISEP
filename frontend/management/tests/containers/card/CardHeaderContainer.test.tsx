import CardHeaderContainer from "../../../src/containers/card/CardHeaderContainer.tsx";
import {render, screen} from "@testing-library/react";

describe('CardHeaderContainer', () => {
  it('should render the CardHeader component ', () => {
    render(<CardHeaderContainer children={undefined}/>)

    const element = screen.getByTestId("card-header-container");
    expect(element).toBeInTheDocument();
  });
})