import {render, screen} from "@testing-library/react";
import HeaderContainer from "../../../src/containers/header/HeaderContainer";
import {MemoryRouter} from "react-router-dom";

describe('HeaderContainer', () => {
  it('should render the Header component ', () => {
    render(<MemoryRouter><HeaderContainer/></MemoryRouter>)

    const element = screen.getByTestId("header");
    expect(element).toBeInTheDocument();
  });
})