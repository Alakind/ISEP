const mockSetIsSelected = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../../src/components/table/TableBody.tsx", () => ({
  __esModule: true,
  default: ({tableData, handleSelect, goToApplicantPage, isSelected}: {
    goToApplicantPage: (id: string) => void;
    tableData: ApplicantInterface[];
    handleSelect: (id: string) => void;
    isSelected: Selection[]
  }) => (
    <div data-testid="table-body">
      {tableData.map((data: ApplicantInterface, index: number) => (
        <div key={data.id} data-testid={`row-${index}`}>
          <span onClick={() => goToApplicantPage(data.id)}>{data.name}</span>
          <button onClick={() => handleSelect(data.id)}>Select</button>
          <span>{isSelected.find((item: Selection) => item.id === data.id)?.checked ? "Selected" : "Not Selected"}</span>
        </div>
      ))}
    </div>
  ),
}));

import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {MemoryRouter, useNavigate} from "react-router-dom";
import {ApplicantInterface, Column, Selection} from "../../../src/utils/types.tsx";
import TableBodyContainer from "../../../src/containers/table/TableBodyContainer.tsx";


describe("TableBodyContainer", () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ];

  const mockTableData: ApplicantInterface[] = [
    {createdAt: new Date(), id: "1", name: "John Doe", email: "john@example.com", preferredLanguage: "Kotlin", scores: [85], statuses: [], invites: []},
    {createdAt: new Date(), id: "2", name: "Jane Smith", email: "jane@example.com", preferredLanguage: "Kotlin", scores: [90], statuses: [], invites: []},
    {createdAt: new Date(), id: "3", name: "Jay Skip", email: "jay@example.com", preferredLanguage: "Kotlin", scores: [50], statuses: [], invites: []},
  ];

  const mockIsSelected: Selection[] = [
    {id: "1", checked: false},
    {id: "2", checked: true},
    {id: "3", checked: true},
  ];

  it("renders the table body with rows", () => {
    render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("table-body")).toBeInTheDocument();
    expect(screen.getAllByTestId(/row-/)).toHaveLength(mockTableData.length);
  });

  it("navigates to the applicant info page on row click", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    const firstRow = screen.getByText("John Doe");
    fireEvent.click(firstRow);

    expect(mockNavigate).toHaveBeenCalledWith("/applicants/1/info");
  });

  it("calls setIsSelected with updated selection state when a row is selected", () => {
    render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    const firstRowSelectButton = screen.getAllByText("Select", {selector: "button"})[0];
    fireEvent.click(firstRowSelectButton);

    expect(mockSetIsSelected).toHaveBeenCalled();
    expect(mockSetIsSelected).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it("displays correct selection status for rows", () => {
    render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    const rowStatuses = screen.getAllByRole('button', {name: /select/i});

    expect(rowStatuses[0].nextSibling).toBeInTheDocument();
    expect(rowStatuses[0].nextSibling).toHaveTextContent("Not Selected");
    expect(rowStatuses[1].nextSibling).toBeInTheDocument();
    expect(rowStatuses[1].nextSibling).toHaveTextContent("Selected");
    expect(rowStatuses[2].nextSibling).toBeInTheDocument();
    expect(rowStatuses[2].nextSibling).toHaveTextContent("Selected");
  });

  it("displays correct table with undefined isSelected", () => {
    render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={undefined}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("table-body")).toBeInTheDocument();
    expect(screen.getAllByTestId(/row-/)).toHaveLength(mockTableData.length);
  });

  it("calls handleSelect and updates respective applicants with(out) wrong id", () => {
    const mockIsSelected: Selection[] = [
      {id: "1", checked: false},
      {id: "2", checked: true},
      {id: "4", checked: true},
    ];

    const mockSetIsSelected = vi.fn((updateFn) => {
      const newState = updateFn(mockIsSelected);
      mockIsSelected.splice(0, mockIsSelected.length, ...newState);
    });

    const {rerender} = render(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    const firstRowSelectButton = screen.getAllByText("Select", {selector: "button"})[0];
    fireEvent.click(firstRowSelectButton);

    expect(mockSetIsSelected).toHaveBeenCalledTimes(1);
    expect(mockIsSelected).toEqual([
      {id: "1", checked: true},
      {id: "2", checked: true},
      {id: "4", checked: true},
    ]);

    rerender(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    // Test with an invalid id
    const mockUpdateFn = vi.fn((prevState) => prevState);
    mockSetIsSelected.mockImplementationOnce(mockUpdateFn);

    const invalidRowSelectButton = screen.getAllByText("Select", {selector: "button"})[2];
    fireEvent.click(invalidRowSelectButton);
    expect(mockUpdateFn).toHaveBeenCalledWith(expect.any(Function));
    expect(mockIsSelected).toEqual([
      {id: "1", checked: true},
      {id: "2", checked: true},
      {id: "4", checked: true},
    ]);

    rerender(
      <MemoryRouter>
        <TableBodyContainer
          columns={mockColumns}
          tableData={mockTableData}
          isSelected={mockIsSelected}
          setIsSelected={mockSetIsSelected}
        />
      </MemoryRouter>
    );

    // Test with no state changes (toggling back to original state)
    fireEvent.click(firstRowSelectButton);
    expect(mockIsSelected).toEqual([
      {id: "1", checked: false}, // Back to original should be false
      {id: "2", checked: true},
      {id: "4", checked: true},
    ]);
  });
});
