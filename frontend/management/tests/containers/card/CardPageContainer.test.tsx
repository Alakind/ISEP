import {render, screen} from "@testing-library/react";
import CardPageContainer from "../../../src/containers/card/CardPageContainer.tsx";

describe('CardPageContainer', () => {
  it('should render the CardPage component ', () => {
    render(<CardPageContainer children={undefined}/>)

    const element = screen.getByTestId("card-page-container");
    expect(element).toBeInTheDocument();
  });
})