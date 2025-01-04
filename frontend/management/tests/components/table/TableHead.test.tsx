import {Column} from "../../../src/utils/types.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import TableHead from "../../../src/components/table/TableHead.tsx";

describe("TableHead Component", () => {
  const mockColumns: Column[] = [
    {accessor: "name", label: "Name", sortable: true},
    {accessor: "email", label: "Email", sortable: false},
    {accessor: "select", label: "Select", sortable: false},
  ];

  const mockHandleSorting = vi.fn();
  const mockHandleSelectAll = vi.fn();

  it("renders all columns with the correct labels", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField=""
          order=""
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const nameColumn = screen.getByText("Name");
    const emailColumn = screen.getByText("Email");
    const selectCheckbox = screen.getByTestId("checkbox-all");

    expect(nameColumn).toBeInTheDocument();
    expect(emailColumn).toBeInTheDocument();
    expect(selectCheckbox).toBeInTheDocument();
  });

  it("calls handleSorting when a sortable column header is clicked", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField=""
          order=""
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const nameColumn = screen.getByText("Name");
    fireEvent.click(nameColumn);

    expect(mockHandleSorting).toHaveBeenCalledWith("name");
    mockHandleSorting.mockReset();
  });

  it("does not have a handleSorting function onClick when a non-sortable column header is clicked", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField=""
          order=""
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const emailColumn = screen.getByText("Email");
    fireEvent.click(emailColumn);

    expect(mockHandleSorting).not.toHaveBeenCalled();
    expect(emailColumn).not.toHaveClass("sort")
  });

  it("calls handleSelectAll when the select-all checkbox is clicked", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField=""
          order=""
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const selectCheckbox = screen.getByTestId("checkbox-all").firstElementChild;
    if (selectCheckbox) {
      fireEvent.click(selectCheckbox);
      expect(mockHandleSelectAll).toHaveBeenCalledWith(expect.any(Boolean));
    } else {
      console.log("No checkbox selected");
    }
  });

  it("applies the correct sorting class to a sortable column", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField="name"
          order="asc"
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const nameColumn = screen.getByText("Name");
    expect(nameColumn).toHaveClass("sort down");
  });

  it("applies the correct sorting class to a sortable column (desc)", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField="name"
          order="desc"
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const nameColumn = screen.getByText("Name");
    expect(nameColumn).toHaveClass("sort up");
  });

  it("applies the correct default class for unsorted columns", () => {
    render(
      <table>
        <TableHead
          columns={mockColumns}
          sortField=""
          order=""
          handleSorting={mockHandleSorting}
          handleSelectAll={mockHandleSelectAll}
        />
      </table>
    );

    const emailColumn = screen.getByText("Email").closest("th");
    expect(emailColumn).not.toHaveClass("sort down");
    expect(emailColumn).not.toHaveClass("sort up");
  });
});