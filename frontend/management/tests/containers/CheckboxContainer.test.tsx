import {beforeEach} from "vitest";
import Checkbox from "../../src/components/Checkbox.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import CheckboxContainer from "../../src/containers/CheckboxContainer.tsx";

vi.mock('../components/Checkbox.tsx', () => ({
  __esModule: true,
  default: ({id, handleOptionChange, isChecked}: { id: string; handleOptionChange: (id: string) => void; isChecked: boolean }) => (
    <Checkbox
      id={id}
      handleOptionChange={handleOptionChange}
      isChecked={isChecked}/>
  )
}));

describe("CheckboxContainer Component", () => {
  const mockAdditionalAction = vi.fn();

  beforeEach(
    mockAdditionalAction.mockReset
  )

  it("renders a checkbox with the correct initial state for a single checkbox", () => {
    render(
      <CheckboxContainer
        id="checkbox-1"
        additionalAction={mockAdditionalAction}
        isSelected={[{id: "checkbox-1", checked: true}]}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it("renders a checkbox with the correct initial state for 'checkbox-all'", () => {
    render(<CheckboxContainer id="checkbox-all" additionalAction={mockAdditionalAction}/>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("calls additionalAction with the correct argument when a checkbox is clicked", () => {
    render(
      <CheckboxContainer
        id="checkbox-1"
        additionalAction={mockAdditionalAction}
        isSelected={[{id: "checkbox-1", checked: false}]}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockAdditionalAction).toHaveBeenCalledWith("checkbox-1");
  });

  it("toggles the isChecked state correctly for 'checkbox-all'", () => {
    render(<CheckboxContainer id="checkbox-all" additionalAction={mockAdditionalAction}/>);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(mockAdditionalAction).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(mockAdditionalAction).toHaveBeenCalledWith(false);
  });

  it("does not throw if additionalAction is not provided", () => {
    render(<CheckboxContainer id="checkbox-1"/>);

    expect(mockAdditionalAction).toHaveBeenCalledTimes(0);
  });
});