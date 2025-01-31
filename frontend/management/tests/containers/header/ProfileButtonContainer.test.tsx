import {render, screen} from "@testing-library/react";
import ProfileButtonContainer from "../../../src/containers/header/ProfileButtonContainer.tsx";
import {MemoryRouter} from "react-router-dom";

describe('ProfileButtonContainer', () => {
  it('should render the ProfileButton component ', () => {
    render(<MemoryRouter><ProfileButtonContainer/></MemoryRouter>)

    const element = screen.getByTestId("profile-button");
    expect(element).toBeInTheDocument();
  });
})