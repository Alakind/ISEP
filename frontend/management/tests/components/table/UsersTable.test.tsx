import {UserInterface} from "../../../src/utils/types.tsx";
import {Roles} from "../../../src/utils/constants.tsx";
import {render, screen} from "@testing-library/react";
import UsersTable from "../../../src/components/table/UsersTable.tsx";
import {MemoryRouter} from "react-router-dom";

describe('UsersTable component', () => {
  const mockUserData: UserInterface[] = [
    {id: '1', name: 'User 1', email: 'user1@example.com', role: Roles.ADMIN, oid: ""},
    {id: '2', name: 'User 2', email: 'user2@example.com', role: Roles.INTERVIEWER, oid: ""},
  ];

  const mockSetOrderBy = vi.fn();
  const mockIsSelected = vi.fn();

  it('should render the users table with head and body', () => {
    render(
      <MemoryRouter>
        <UsersTable data={mockUserData} orderBy={""} setOrderBy={mockSetOrderBy} setIsSelected={mockIsSelected} isSelected={[]}/>
      </MemoryRouter>
    );

    expect(screen.getByTestId("users-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-head")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });
})