import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ApplicantAddCardContainer from '../../../src/containers/applicant-add/ApplicantAddCardContainer';
import {toast} from 'react-toastify';
import {addApplicant} from '../../../src/utils/apiFunctions';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {vi} from "vitest";

vi.mock('../../../src/utils/apiFunctions', () => ({
  addApplicant: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('ApplicantAddCardContainer', () => {
  const mockNavigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the ApplicantAddCard component', () => {
    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    expect(screen.getByRole('textbox', {name: /name/i})).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /email/i})).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /preferred language/i})).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('textbox', {name: /name/i});
    const emailInput = screen.getByRole('textbox', {name: /email/i});
    const preferredLanguageInput = screen.getByRole('textbox', {name: /preferred language/i});

    fireEvent.change(nameInput, {target: {value: 'John Doe'}});
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
    fireEvent.change(preferredLanguageInput, {target: {value: 'Kotlin'}});

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(preferredLanguageInput).toHaveValue('Kotlin');
  });

  it('should show an info toast if required fields are missing or invalid', async () => {
    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const addButton = screen.getByText('Add', {exact: true});

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'Could not add applicant. Fill in the required fields and a valid email address.'
      );
    });
  });

  it('should successfully add an applicant and navigate to invite page if goToInvite is true', async () => {
    vi.mocked(addApplicant).mockResolvedValueOnce({id: '123'});

    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('textbox', {name: /name/i});
    const emailInput = screen.getByRole('textbox', {name: /email/i});
    const addButton = screen.getByRole('button', {name: /add & invite/i});

    fireEvent.change(nameInput, {target: {value: 'John Doe'}});
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addApplicant).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        preferredLanguage: '',
      });
      expect(toast.success).toHaveBeenCalledWith('Successfully added applicant!');
      expect(mockNavigate).toHaveBeenCalledWith('/applicants/123/invite/add');
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(addApplicant).mockRejectedValueOnce(new Error('Failed to add applicant'));

    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('textbox', {name: /name/i});
    const emailInput = screen.getByRole('textbox', {name: /email/i});
    const addButton = screen.getByText('Add', {exact: true});

    fireEvent.change(nameInput, {target: {value: 'John Doe'}});
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addApplicant).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Failed to add applicant');
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(addApplicant).mockRejectedValueOnce(null);

    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('textbox', {name: /name/i});
    const emailInput = screen.getByRole('textbox', {name: /email/i});
    const addButton = screen.getByText('Add', {exact: true});

    fireEvent.change(nameInput, {target: {value: 'John Doe'}});
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addApplicant).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('should clear fields after adding an applicant', async () => {
    vi.mocked(addApplicant).mockResolvedValueOnce({id: '123'});

    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('textbox', {name: /name/i});
    const emailInput = screen.getByRole('textbox', {name: /email/i});
    const addButton = screen.getByText('Add', {exact: true});

    fireEvent.change(nameInput, {target: {value: 'John Doe'}});
    fireEvent.change(emailInput, {target: {value: 'john.doe@example.com'}});
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
  });

  it('should navigate to /applicants on cancel', () => {
    render(
      <MemoryRouter>
        <ApplicantAddCardContainer/>
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/applicants');
  });
});
