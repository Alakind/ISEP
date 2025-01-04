import CheckboxLoadingContainer from "../../src/containers/CheckboxLoadingContainer.tsx";
import {render, screen} from "@testing-library/react";

describe('CheckboxLoadingContainer', () => {
  it('should render the checkboxLoading component ', () => {
    render(<CheckboxLoadingContainer id={"123"}/>)

    const element = screen.getByTestId("checkbox-loading")
    expect(element).toBeInTheDocument();
  });
})