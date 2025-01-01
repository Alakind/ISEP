import TableBodyLoading from "../../../../src/components/table/loading/TableBodyLoading.tsx";
import {render, screen} from "@testing-library/react";
import {Column} from "../../../../src/utils/types.tsx";

describe("TableBodyLoading Component", () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ]

  it("renders the correct number of rows based on itemsPerPage", () => {
    const itemsPerPage = 5;

    render(<TableBodyLoading columns={mockColumns} itemsPerPage={itemsPerPage}/>);

    const rows = screen.getAllByTestId(/table-row-loading-/);
    expect(rows).toHaveLength(itemsPerPage);
  });

  it("passes the correct id to each TableRowLoading component", () => {
    const itemsPerPage = 3;

    render(<TableBodyLoading columns={mockColumns} itemsPerPage={itemsPerPage}/>);

    for (let i = 0; i < itemsPerPage; i++) {
      const row = screen.getByTestId(`table-row-loading-${i}`);
      expect(row).toBeInTheDocument();
    }
  });
});