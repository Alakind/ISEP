import {Column} from "../../../../src/utils/types.tsx";
import {render, screen} from "@testing-library/react";
import TableLoading from "../../../../src/components/table/loading/TableLoading.tsx";
import {expect} from "vitest";

describe('TableLoading component', () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ]
  const mockItemsPerPage = 3;

  it("renders the table element", () => {
    render(<TableLoading columns={mockColumns} itemsPerPage={mockItemsPerPage}/>);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const tableHead = screen.getByTestId("table-head-loading");
    expect(tableHead).toBeInTheDocument();
    const tableBody = screen.getByTestId("table-body-loading");
    expect(tableBody).toBeInTheDocument();
  });
})