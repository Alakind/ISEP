import {render, screen} from "@testing-library/react";
import ProfileButtonContainer from "../../../src/containers/header/ProfileButtonContainer.tsx";

describe('ProfileButtonContainer', () => {
  it('should render the ProfileButton component ', () => {
    render(<ProfileButtonContainer urlPrefix={""}/>)

    const element = screen.getByTestId("profile-button");
    expect(element).toBeInTheDocument();
  });
})