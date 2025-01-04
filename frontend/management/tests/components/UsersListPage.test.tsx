import {fireEvent, render, screen} from "@testing-library/react";
import {UserInterface} from "../../src/utils/types.tsx";
import {MemoryRouter} from "react-router-dom";
import UsersListPage from "../../src/components/UsersListPage.tsx";
import {Roles} from "../../src/utils/constants.tsx";

describe('UsersListPage Component', () => {
  const mockSetCurrentPage = vi.fn();
  const mockSetItemsPerPage = vi.fn();
  const mockSetOrderBy = vi.fn();
  const mockSetQuery = vi.fn();
  const mockSetIsSelected = vi.fn();
  const mockRemoveUser = vi.fn();

  const mockData: UserInterface[] = [
    {
      id: '1', name: 'User 1', email: 'user1@example.com',
      role: Roles.ADMIN,
    },
    {
      id: '2', name: 'User 2', email: 'user2@example.com',
      role: Roles.INTERVIEWER
    },
  ];

  it('renders the loading state when loading is true', () => {
    render(
      <UsersListPage
        data={[]}
        totalItems={0}
        loading={true}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        orderBy="name"
        setOrderBy={mockSetOrderBy}
        setQuery={mockSetQuery}
        isSelected={[]}
        setIsSelected={mockSetIsSelected}
        removeUser={mockRemoveUser}
      />
    );

    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
  });

  it('renders the applicants table when data is available', () => {
    render(
      <MemoryRouter>
        <UsersListPage
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
          isSelected={[]}
          setIsSelected={mockSetIsSelected}
          removeUser={mockRemoveUser}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('users-table')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('updates query when search input changes', () => {
    render(
      <MemoryRouter>
        <UsersListPage
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
          isSelected={[]}
          setIsSelected={mockSetIsSelected}
          removeUser={mockRemoveUser}
        />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole('textbox', {name: 'Search'});
    fireEvent.change(searchInput, {target: {value: 'test'}});

    expect(mockSetQuery).toHaveBeenCalledWith('name=test');
  });

  it('renders bulk action select', () => {
    render(
      <MemoryRouter>
        <UsersListPage
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
          isSelected={[]}
          setIsSelected={mockSetIsSelected}
          removeUser={mockRemoveUser}
        />
      </MemoryRouter>
    );
    
    const bulkActionSelect = screen.getByTestId('bulk-action-select');
    expect(bulkActionSelect).toBeInTheDocument();
  });

  it('changes the items per page when the select value changes', () => {
    render(
      <MemoryRouter>
        <UsersListPage
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
          isSelected={[]}
          setIsSelected={mockSetIsSelected}
          removeUser={mockRemoveUser}
        />
      </MemoryRouter>
    );

    const itemsPerPageSelect = screen.getByLabelText(/Items per page:/i);
    fireEvent.change(itemsPerPageSelect, {target: {value: '25'}});

    expect(mockSetItemsPerPage).toHaveBeenCalledWith(25);
  });

  it('navigates between pages using the pagination component', () => {
    render(
      <MemoryRouter>
        <UsersListPage
          data={mockData}
          totalItems={2}
          loading={false}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
          orderBy="name"
          setOrderBy={mockSetOrderBy}
          setQuery={mockSetQuery}
          isSelected={[]}
          setIsSelected={mockSetIsSelected}
          removeUser={mockRemoveUser}
        />
      </MemoryRouter>
    );

    const nextButton = screen.getAllByRole('button', {name: ''})[2];
    fireEvent.click(nextButton);

    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });
});