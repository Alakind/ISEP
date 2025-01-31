import ItemPerPageSelect from "../../../src/components/table/ItemsPerPageSelect.tsx";
import {fireEvent, render, screen} from "@testing-library/react";

describe("ItemPerPageSelect Component", () => {
  const mockHandleSelect = vi.fn();
  const mockItemsPerPage = 25;

  it("renders the label and select element", () => {
    render(
      <ItemPerPageSelect
        itemsPerPage={mockItemsPerPage}
        handleSelect={mockHandleSelect}
      />
    );

    const label = screen.getByLabelText("Items per page:");
    expect(label).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue(mockItemsPerPage.toString());
  });

  it("renders all options correctly", () => {
    render(
      <ItemPerPageSelect
        itemsPerPage={mockItemsPerPage}
        handleSelect={mockHandleSelect}
      />
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);

    expect(options[0]).toHaveTextContent("10");
    expect(options[0]).toHaveValue("10");

    expect(options[1]).toHaveTextContent("25");
    expect(options[1]).toHaveValue("25");

    expect(options[2]).toHaveTextContent("50");
    expect(options[2]).toHaveValue("50");

    expect(options[3]).toHaveTextContent("All");
    expect(options[3]).toHaveValue("-1");
  });

  it("calls handleSelect when an option is selected", () => {
    render(
      <ItemPerPageSelect
        itemsPerPage={mockItemsPerPage}
        handleSelect={mockHandleSelect}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {target: {value: "50"}});

    expect(mockHandleSelect).toHaveBeenCalled();
    expect(mockHandleSelect.mock.calls[0][0].target.value).toBe("50");
  });

  it("sets the correct default value", () => {
    render(
      <ItemPerPageSelect
        itemsPerPage={50}
        handleSelect={mockHandleSelect}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("50");
  });
});