import UsersTableContainer from "../../../src/containers/table/UsersTableContainer.tsx";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

const mockSetOrderBy = vi.fn();
const mockSetIsSelected = vi.fn();

describe('UsersTableContainer', () => {
  it('should render the UsersTable component ', () => {
    render(<MemoryRouter><UsersTableContainer data={[]} orderBy={""} setOrderBy={mockSetOrderBy} setIsSelected={mockSetIsSelected} isSelected={[]}/></MemoryRouter>)

    const element = screen.getByTestId("users-table");
    expect(element).toBeInTheDocument();
  });
})