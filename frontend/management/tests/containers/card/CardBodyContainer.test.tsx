import {render, screen} from "@testing-library/react";
import CardBodyContainer from "../../../src/containers/card/CardBodyContainer.tsx";

describe('CardBodyContainer', () => {
  it('should render the CardBody component ', () => {
    render(<CardBodyContainer children={undefined}/>)

    const element = screen.getByTestId("card-body-container");
    expect(element).toBeInTheDocument();
  });
})