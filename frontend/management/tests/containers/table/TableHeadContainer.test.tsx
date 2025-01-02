vi.mock("../../../src/components/table/TableHead.tsx", () => ({
  __esModule: true,
  default: ({columns, handleSorting, handleSelectAll}: {
    columns: Column[];
    handleSorting: (accessor: string) => void;
    handleSelectAll: (value: boolean) => void;
  }) => (
    <div data-testid="table-head">
      {columns.map((col) => (
        <div
          key={col.accessor}
          data-testid={`column-${col.accessor}`}
          onClick={() => handleSorting(col.accessor)}
        >
          {col.label}
        </div>
      ))}
      <button data-testid="select-all" onClick={() => handleSelectAll(true)}>
        Select All
      </button>
      <button data-testid="deselect-all" onClick={() => handleSelectAll(false)}>
        Deselect All
      </button>
    </div>
  ),
}));

import {fireEvent, render, screen} from "@testing-library/react";
import TableHeadContainer from "../../../src/containers/table/TableHeadContainer";
import {Column, Selection} from "../../../src/utils/types";

describe("TableHeadContainer", () => {
  const mockColumns: Column[] = [
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ];

  const mockSetOrderBy = vi.fn();
  const mockSetIsSelected = vi.fn();

  it("renders TableHead with the correct props", () => {
    render(
      <TableHeadContainer
        columns={mockColumns}
        orderBy="name,asc"
        setOrderBy={mockSetOrderBy}
        setIsSelected={mockSetIsSelected}
      />
    );

    expect(screen.getByTestId("table-head")).toBeInTheDocument();
    mockColumns.forEach((col) => {
      expect(screen.getByTestId(`column-${col.accessor}`)).toBeInTheDocument();
    });
  });

  it("updates sorting state and calls setOrderBy when a sortable column is clicked", () => {
    render(
      <TableHeadContainer
        columns={mockColumns}
        orderBy="name,asc"
        setOrderBy={mockSetOrderBy}
        setIsSelected={mockSetIsSelected}
      />
    );

    const nameColumn = screen.getByTestId("column-name");
    fireEvent.click(nameColumn);

    expect(mockSetOrderBy).toHaveBeenCalledWith("name,desc");

    fireEvent.click(nameColumn);

    expect(mockSetOrderBy).toHaveBeenCalledWith("name,asc");
  });

  it("calls handleSelectAll with true when 'Select All' is clicked", () => {
    const mockSelections: Selection[] = [
      {id: "1", checked: false},
      {id: "2", checked: false},
    ];

    mockSetIsSelected.mockImplementation((updateFn) => {
      const updatedState = updateFn(mockSelections);
      mockSelections.splice(0, mockSelections.length, ...updatedState); // Simulate state update
    });

    render(
      <TableHeadContainer
        columns={mockColumns}
        orderBy="name,asc"
        setOrderBy={mockSetOrderBy}
        setIsSelected={mockSetIsSelected}
      />
    );

    const selectAllButton = screen.getByTestId("select-all");
    fireEvent.click(selectAllButton);

    expect(mockSetIsSelected).toHaveBeenCalled();
    expect(mockSelections.every((item) => item.checked)).toBe(true);
  });

  it("calls handleSelectAll with false when 'Deselect All' is clicked", () => {
    const mockSelections: Selection[] = [
      {id: "1", checked: true},
      {id: "2", checked: true},
    ];

    mockSetIsSelected.mockImplementation((updateFn) => {
      const updatedState = updateFn(mockSelections);
      mockSelections.splice(0, mockSelections.length, ...updatedState); // Simulate state update
    });

    render(
      <TableHeadContainer
        columns={mockColumns}
        orderBy="name,asc"
        setOrderBy={mockSetOrderBy}
        setIsSelected={mockSetIsSelected}
      />
    );

    const deselectAllButton = screen.getByTestId("deselect-all");
    fireEvent.click(deselectAllButton);

    expect(mockSetIsSelected).toHaveBeenCalled();
    expect(mockSelections.every((item) => !item.checked)).toBe(true);
  });
});
