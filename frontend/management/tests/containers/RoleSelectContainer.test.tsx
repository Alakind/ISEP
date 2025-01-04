vi.mock('../../src/utils/apiFunctions.tsx', () => ({
  __esModule: true,
  updateUser: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {toast} from "react-toastify";
import {Roles} from "../../src/utils/constants.tsx";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import RoleSelectContainer from "../../src/containers/RoleSelectContainer.tsx";
import {updateUser} from "../../src/utils/apiFunctions.tsx";


describe('RoleSelectContainer Component', () => {
  const mockProps = {
    id: 'user-id-123',
    disabled: false,
    initialRole: Roles.INTERVIEWER,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders RoleSelect with initial role', () => {
    render(<RoleSelectContainer {...mockProps} />);

    const selectElement = screen.getByTestId(`role-select`).firstChild;
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue(mockProps.initialRole);
  });

  it('disables the RoleSelect when loading', async () => {
    vi.mocked(updateUser).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({data: {role: Roles.ADMIN}}), 500))
    );

    const {rerender} = render(<RoleSelectContainer {...mockProps} />);

    // Fire event to change value
    const selectElement = screen.getByTestId(`role-select-combobox`);
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN}});

    // Check if select box becomes disabled
    await waitFor(() => {
      rerender(<RoleSelectContainer {...mockProps}/>)

      const selectElement = screen.getByTestId(`role-select-combobox`);
      expect(selectElement).toHaveClass('dropdown__select--disabled');
      expect(selectElement.firstChild).toHaveTextContent(Roles.INTERVIEWER);
    });

    // Check if select box becomes combobox again and the value has changed
    await waitFor(() => {
      rerender(<RoleSelectContainer {...mockProps} />)

      const selectElement = screen.getByTestId(`role-select-combobox`);
      expect(selectElement).not.toHaveClass('dropdown__select--disabled');
      expect(selectElement).toHaveValue(Roles.ADMIN);

      const selectedOption = screen.getByRole('option', {name: Roles.ADMIN, selected: true});
      expect(selectedOption).toBeInTheDocument();
    });

    expect(updateUser).toHaveBeenCalledWith(mockProps.id, {role: Roles.ADMIN});
  });

  it('updates role and shows success toast on valid API response', async () => {
    vi.mocked(updateUser).mockResolvedValue({data: {role: Roles.ADMIN}});

    render(<RoleSelectContainer {...mockProps} />);

    const selectElement = screen.getByTestId(`role-select-combobox`);
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN}});

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockProps.id, {role: Roles.ADMIN});
      expect(toast.success).toHaveBeenCalledWith('Successfully changed role');
      expect(selectElement).toHaveValue(Roles.ADMIN);
    });
  });

  it('shows error toast on API failure', async () => {
    vi.mocked(updateUser).mockRejectedValue(new Error('API Error'));

    const {rerender} = render(<RoleSelectContainer {...mockProps} />);

    const selectElement = screen.getByTestId(`role-select-combobox`);
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN}});

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockProps.id, {role: Roles.ADMIN});
      expect(toast.error).toHaveBeenCalledWith('API Error');

      rerender(<RoleSelectContainer {...mockProps} />)
      const selectElement = screen.getByTestId(`role-select-combobox`);
      expect(selectElement).toHaveValue(mockProps.initialRole);
    });
  });


  it('shows error toast on API failure when role is undefined', async () => {
    vi.mocked(updateUser).mockResolvedValue({data: {role: undefined}});

    const {rerender} = render(<RoleSelectContainer {...mockProps} />);

    const selectElement = screen.getByTestId(`role-select-combobox`);
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN}});

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockProps.id, {role: Roles.ADMIN});
      expect(toast.error).toHaveBeenCalledWith('Failed to update role: role is undefined in the response.');

      rerender(<RoleSelectContainer {...mockProps} />)
      const selectElement = screen.getByTestId(`role-select-combobox`);
      expect(selectElement).toHaveValue(mockProps.initialRole);
    });
  });

  it('handles unknown error gracefully', async () => {
    vi.mocked(updateUser).mockRejectedValue(null);

    const {rerender} = render(<RoleSelectContainer {...mockProps} />);

    const selectElement = screen.getByTestId(`role-select-combobox`);
    fireEvent.change(selectElement, {target: {value: Roles.ADMIN}});

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockProps.id, {role: Roles.ADMIN});
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');

      rerender(<RoleSelectContainer {...mockProps} />)
      const selectElement = screen.getByTestId(`role-select-combobox`);
      expect(selectElement).toHaveValue(mockProps.initialRole);
    });
  });
});