import BulkActionSelect from "../../../src/components/table/BulkActionSelect.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe("BulkActionSelect Component", () => {
  const mockHandleSelect = vi.fn();
  const mockSetSelectedOption = vi.fn();
  const mockOptions = ["Option 1", "Option 2", "Option 3"];
  const mockSelectedOption = "Option 2";

  it("renders the label and select element", () => {
    render(
      <BulkActionSelect
        loading={false}
        options={mockOptions}
        handleSelect={mockHandleSelect}
        selectedOption={mockSelectedOption}
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const label = screen.getByLabelText("Actions:");
    expect(label).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue(mockSelectedOption);
  });

  it("renders all options correctly", () => {
    render(
      <BulkActionSelect
        loading={false}
        options={mockOptions}
        handleSelect={mockHandleSelect}
        selectedOption={mockSelectedOption}
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(mockOptions.length);

    mockOptions.forEach((option, index) => {
      expect(options[index]).toHaveTextContent(option);
      expect(options[index]).toHaveValue(option);
    });
  });

  it("calls handleSelect when an option is selected", () => {
    render(
      <BulkActionSelect
        loading={false}
        options={mockOptions}
        handleSelect={mockHandleSelect}
        selectedOption={mockSelectedOption}
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {target: {value: "Option 3"}});

    expect(mockHandleSelect).toHaveBeenCalled();
  });

  it("disables the select element when loading is true", () => {
    render(
      <BulkActionSelect
        loading={true}
        options={mockOptions}
        handleSelect={mockHandleSelect}
        selectedOption={mockSelectedOption}
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("calls setSelectedOption when an option is clicked", () => {
    render(
      <BulkActionSelect
        loading={false}
        options={mockOptions}
        handleSelect={mockHandleSelect}
        selectedOption={mockSelectedOption}
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const options = screen.getAllByRole("option");
    fireEvent.click(options[2]);

    expect(mockSetSelectedOption).toHaveBeenCalledWith("Option 3");
  });
});