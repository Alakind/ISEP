import {fireEvent, render, screen} from "@testing-library/react";
import TableRowUsers from "../../../src/components/table/TableRowUsers.tsx";
import {Column, Selection, UserInterface} from "../../../src/utils/types.tsx";
import {Roles} from "../../../src/utils/constants.tsx";

describe('TableRowUsers Component', () => {
  const mockColumns: Column[] = [
    {label: "Select", accessor: "select", sortable: false},
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
  ]

  const mockData: UserInterface = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: Roles.ADMIN,
  };

  const mockHandleSelect = vi.fn();
  const mockIsSelected: Selection[] = [{id: '1', checked: true}];

  it('renders table row with user data', () => {
    render(
      <table>
        <tbody>
        <TableRowUsers
          data={mockData}
          columns={mockColumns}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
        </tbody>
      </table>
    );

    // Assert user data rendering
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();

    // Assert RoleSelectContainer rendering
    expect(screen.getByTestId('role-select')).toBeInTheDocument();

    // Assert CheckboxContainer rendering
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('renders role select container as disabled for default admin email', () => {
    const dataWithAdminEmail = {
      ...mockData,
      email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL,
    };

    render(
      <table>
        <tbody>
        <TableRowUsers
          data={dataWithAdminEmail}
          columns={mockColumns}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('role-select').firstChild).toHaveClass('dropdown__select--disabled');
  });

  it('triggers handleSelect when checkbox is toggled', () => {
    render(
      <table>
        <tbody>
        <TableRowUsers
          data={mockData}
          columns={mockColumns}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
        </tbody>
      </table>
    );

    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandleSelect).toHaveBeenCalledWith(mockData.id);
  });
});