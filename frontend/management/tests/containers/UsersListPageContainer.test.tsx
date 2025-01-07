import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import UsersListPageContainer from '../../src/containers/UsersListPageContainer';
import {deleteUser, getUsers} from '../../src/utils/apiFunctions.tsx';
import {toast} from 'react-toastify';
import {UserInterface} from '../../src/utils/types';
import {Roles} from "../../src/utils/constants.tsx";
import {MemoryRouter} from "react-router-dom";
import {vi} from "vitest";

vi.mock('../../src/utils/apiFunctions.tsx', () => ({
  __esModule: true,
  getUsers: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  __esModule: true,
  toast: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('UsersListPageContainer', () => {
  const mockUsers: UserInterface[] = [
    {
      id: '1', name: 'John Doe', email: 'john@example.com',
      role: Roles.ADMIN
    },
    {
      id: '2', name: 'Jane Doe', email: 'jane@example.com',
      role: Roles.INTERVIEWER
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and render user data', async () => {
    vi.mocked(getUsers).mockResolvedValueOnce({
      data: mockUsers,
      totalItems: 2,
    });

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    expect(getUsers).toHaveBeenCalledWith(0, 10, 'name,asc', '');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(getUsers).mockRejectedValueOnce(new Error('Failed to fetch users'));

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch users');
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully (unknown error)', async () => {
    vi.mocked(getUsers).mockRejectedValueOnce(null);

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should update the selected state when data changes', async () => {
    vi.mocked(getUsers).mockResolvedValueOnce({
      data: mockUsers,
      totalItems: 2,
    });

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockUsers.length + 1);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should remove a user when removeUser is called', async () => {
    vi.mocked(getUsers).mockResolvedValueOnce({
      data: mockUsers,
      totalItems: 2,
    });
    vi.mocked(deleteUser).mockResolvedValueOnce(`Successfully deleted user`)

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    const removeSelect = screen.getByLabelText(/Actions:/i);
    fireEvent.change(removeSelect, {target: {value: 'Delete selected'}});


    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

      proceedAction();
    })

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('should update query and fetch data when setQuery is called', async () => {
    vi.mocked(getUsers).mockResolvedValueOnce({
      data: mockUsers,
      totalItems: 2,
    });

    render(<MemoryRouter><UsersListPageContainer/></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', {name: /search/i});
    fireEvent.change(searchInput, {target: {value: 'Jane'}});

    await waitFor(() => {
      expect(getUsers).toHaveBeenCalledWith(0, 10, 'name,asc', 'name=Jane');
    });
  });
});
