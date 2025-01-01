import TableRowLoading from "../../../../src/components/table/loading/TableRowLoading.tsx";
import {render, screen} from "@testing-library/react";
import {Column} from "../../../../src/utils/types.tsx";

describe("TableRowLoading Component", () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ]

  it("renders a row with the correct number of cells", () => {
    render(<TableRowLoading columns={mockColumns} id="test-id"/>);

    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(mockColumns.length);
  });

  it("renders CheckboxLoadingContainer for 'select' column", () => {
    render(<TableRowLoading columns={mockColumns} id="test-id"/>);

    const checkboxLoading = screen.getByTestId("checkbox-loading");
    expect(checkboxLoading).toBeInTheDocument();
    expect(checkboxLoading).toBeDisabled();
    expect(checkboxLoading).not.toBeChecked();
  });

  it("renders empty span for non-'select' columns", () => {
    render(<TableRowLoading columns={mockColumns} id="test-id"/>);

    const emptyCells = screen.getAllByTestId("empty-cell");
    expect(emptyCells).toHaveLength(mockColumns.length - (mockColumns.some((column) => column.accessor === "select") ? 1 : 0));

    emptyCells.forEach((cell) => {
      expect(cell).toHaveClass("table-loading__row__cell");
    });
  });
});