import {render, screen} from "@testing-library/react";
import HeaderContainer from "../../../src/containers/header/HeaderContainer";

describe('HeaderContainer', () => {
  it('should render the Header component ', () => {
    render(<HeaderContainer/>)

    const element = screen.getByTestId("header");
    expect(element).toBeInTheDocument();
  });
})