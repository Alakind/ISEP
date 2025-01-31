import TableHeadLoading from "../../../../src/components/table/loading/TableHeadLoading.tsx";
import {render, screen} from "@testing-library/react";
import {Column} from "../../../../src/utils/types.tsx";
import {expect} from "vitest";

describe("TableHeadLoading Component", () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ]

  it("renders a table header row", () => {
    render(
      <table>
        <TableHeadLoading columns={mockColumns}/>
      </table>
    );

    const headerRow = screen.getByRole("row");
    expect(headerRow).toBeInTheDocument();
  });

  it("renders the correct number of header cells", () => {
    render(
      <table>
        <TableHeadLoading columns={mockColumns}/>
      </table>
    );

    const headerCells = screen.getAllByRole("columnheader");
    expect(headerCells).toHaveLength(mockColumns.length);
  });

  it("renders CheckboxLoadingContainer for the 'select' column", () => {
    render(
      <table>
        <TableHeadLoading columns={mockColumns}/>
      </table>
    );

    const checkbox = screen.getByTestId("checkbox-loading-checkbox-all");
    expect(checkbox.firstChild).toBeInTheDocument();
    expect(checkbox.firstChild).toBeDisabled();
    expect(checkbox.firstChild).not.toBeChecked()
  });

  it("renders labels for non-'select' columns", () => {
    render(
      <table>
        <TableHeadLoading columns={mockColumns}/>
      </table>
    );

    const nameHeader = screen.getByText("Name");
    const emailHeader = screen.getByText("Email");

    expect(nameHeader).toBeInTheDocument();
    expect(emailHeader).toBeInTheDocument();
  });
});