import {act, Dispatch, SetStateAction} from "react";
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import ApplicantPersonalCardContainer from '../../../src/containers/applicant-personal/ApplicantPersonalCardContainer';
import {toast} from 'react-toastify';
import {deleteApplicant, updateApplicant} from '../../../src/utils/apiFunctions';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {ApplicantInterface} from "../../../src/utils/types.tsx";
import {Roles} from "../../../src/utils/constants.tsx";

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../../../src/utils/apiFunctions.tsx', () => ({
  deleteApplicant: vi.fn(),
  updateApplicant: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);

const mockApplicant: ApplicantInterface = {
  createdAt: new Date("2025-01-15T23:59:25.803Z"),
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  scores: [85],
  statuses: ['not_started'],
  preferredLanguage: 'Kotlin',
  invites: [],
};

describe('ApplicantPersonalCardContainer', () => {
  const mockSetApplicant = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the ApplicantPersonalCard with correct props and inputs are disabled', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );
    const nameInput = screen.getByRole('textbox', {name: 'Name:'});
    expect(nameInput).toHaveValue('John Doe');
    expect(nameInput).toBeDisabled();

    const emailInput = screen.getByRole('textbox', {name: 'Email:'});
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(emailInput).toBeDisabled();

    const preferredLanguageInput = screen.getByRole('textbox', {name: 'Preferred language:'});
    expect(preferredLanguageInput).toHaveValue('Kotlin');
    expect(preferredLanguageInput).toBeDisabled();
  });

  it('should enable editing mode when handleEdit is called', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByRole('textbox', {name: 'Name:'})).toHaveValue('John Doe');
  });

  it('should show a warning toast when handleDelete is called', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Delete'));

    expect(toast.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          message: "Are you sure you want to delete this applicant? The applicant can't be restored!",
        }),
      }),
      expect.anything()
    );
  });

  it('should call deleteApplicant and navigate on proceedHandleDelete', async () => {
    vi.mocked(deleteApplicant).mockResolvedValueOnce('Applicant deleted successfully');

    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );


    fireEvent.click(screen.getByText('Delete'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

    proceedAction();

    await waitFor(() => {
      expect(deleteApplicant).toHaveBeenCalledWith(mockApplicant.id);
      expect(mockSetApplicant).toHaveBeenCalledWith({
        scores: [],
        statuses: [],
        id: '',
        name: '',
        email: '',
        preferredLanguage: '',
        invites: [],
        createdAt: undefined
      });
      expect(mockNavigate).toHaveBeenCalledWith('/applicants');
      expect(toast.success).toHaveBeenCalledWith('Applicant deleted successfully');
    });
  });

  it('should call deleteApplicant and throw an API error when error is thrown', async () => {
    vi.mocked(deleteApplicant).mockRejectedValueOnce(new Error('API Error'));

    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Delete')); // Assuming "Delete" button exists
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

    proceedAction();

    await waitFor(() => {
      expect(deleteApplicant).toHaveBeenCalledWith(mockApplicant.id);
      expect(toast.error).toHaveBeenCalledWith('API Error');
    });
  });

  it('handles unknown error gracefully when deleteApplicant is called', async () => {
    vi.mocked(deleteApplicant).mockRejectedValueOnce(null);

    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Delete')); // Assuming "Delete" button exists
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const proceedAction = vi.mocked(toast.warn).mock.lastCall[0].props.proceedAction;

    proceedAction();

    await waitFor(() => {
      expect(deleteApplicant).toHaveBeenCalledWith(mockApplicant.id);
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('handles unknown error gracefully when updateApplicant is called', async () => {
    vi.mocked(updateApplicant).mockRejectedValueOnce(null);

    // Create a controlled state for the applicant
    let currentApplicant = {...mockApplicant};

    const mockSetApplicant: Dispatch<SetStateAction<typeof mockApplicant>> = vi.fn(
      (update) => {
        if (typeof update === 'function') {
          currentApplicant = {...currentApplicant, ...update(currentApplicant)};
        } else {
          currentApplicant = {...currentApplicant, ...update};
        }
        rerender(
          <ApplicantPersonalCardContainer
            applicant={currentApplicant}
            setApplicant={mockSetApplicant}
          />
        );
      }
    );

    const {rerender} = render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    act(() => {
      fireEvent.change(screen.getByRole('textbox', {name: 'Name:'}), {target: {value: 'Jane Doe'}});
    })
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateApplicant).toHaveBeenCalledWith(mockApplicant.id, {
        name: 'Jane Doe',
        email: mockApplicant.email,
        preferredLanguage: mockApplicant.preferredLanguage,
      });
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('handles API error gracefully when updateApplicant is called', async () => {
    vi.mocked(updateApplicant).mockRejectedValueOnce(new Error('API Error'));

    // Create a controlled state for the applicant
    let currentApplicant = {...mockApplicant};

    const mockSetApplicant: Dispatch<SetStateAction<typeof mockApplicant>> = vi.fn(
      (update) => {
        if (typeof update === 'function') {
          currentApplicant = {...currentApplicant, ...update(currentApplicant)};
        } else {
          currentApplicant = {...currentApplicant, ...update};
        }
        rerender(
          <ApplicantPersonalCardContainer
            applicant={currentApplicant}
            setApplicant={mockSetApplicant}
          />
        );
      }
    );

    const {rerender} = render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    act(() => {
      fireEvent.change(screen.getByRole('textbox', {name: 'Name:'}), {target: {value: 'Jane Doe'}});
    })
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateApplicant).toHaveBeenCalledWith(mockApplicant.id, {
        name: 'Jane Doe',
        email: mockApplicant.email,
        preferredLanguage: mockApplicant.preferredLanguage,
      });
      expect(toast.error).toHaveBeenCalledWith('API Error');
    });
  });

  it('should handle cancelHandleDelete correctly', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const cancelAction = vi.mocked(toast.warn).mock.lastCall[0].props.cancelAction;

    cancelAction();

    expect(toast.info).toHaveBeenCalledWith("Applicant hasn't been deleted!");
  });

  it('should handleSave and update applicant data', async () => {
    vi.mocked(updateApplicant).mockResolvedValueOnce({
      data: {name: 'Jane Doe'},
    });

    // Create a controlled state for the applicant
    let currentApplicant = {...mockApplicant};

    const mockSetApplicant: Dispatch<SetStateAction<typeof mockApplicant>> = vi.fn(
      (update) => {
        if (typeof update === 'function') {
          currentApplicant = {...currentApplicant, ...update(currentApplicant)};
        } else {
          currentApplicant = {...currentApplicant, ...update};
        }
        rerender(
          <ApplicantPersonalCardContainer
            applicant={currentApplicant}
            setApplicant={mockSetApplicant}
          />
        );
      }
    );

    const {rerender} = render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    act(() => {
      fireEvent.change(screen.getByRole('textbox', {name: 'Name:'}), {target: {value: 'Jane Doe'}});
    })
    fireEvent.click(screen.getByText('Save'));


    await waitFor(() => {
      expect(updateApplicant).toHaveBeenCalledWith(mockApplicant.id, {
        name: 'Jane Doe',
        email: mockApplicant.email,
        preferredLanguage: mockApplicant.preferredLanguage,
      });
      expect(toast.success).toHaveBeenCalledWith('Successfully saved!');
      expect(mockSetApplicant).toHaveBeenCalledTimes(1);
      expect(mockSetApplicant).toHaveBeenCalledWith(expect.anything());
    });
  });

  it('should handleCancel and restore previous applicant data', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockSetApplicant).toHaveBeenCalledWith(mockApplicant);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show an error toast when prevApplicantData is null on cancel', () => {
    vi.mock('react', async () => {
      const ActualReact = await vi.importActual<typeof import('react')>('react');
      return {
        ...ActualReact,
        useState: vi.fn((initialState) => {
          if (initialState.id === 'null') {
            return [null, vi.fn()]; // Mock prevApplicantData as null
          }
          return ActualReact.useState(initialState); // Default fallback
        }),
      };
    });

    render(
      <ApplicantPersonalCardContainer
        applicant={{...mockApplicant, id: 'null'}}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockSetApplicant).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('No previous data to restore!');
  });

  it('should handleChange and update applicant field', () => {
    render(
      <ApplicantPersonalCardContainer
        applicant={mockApplicant}
        setApplicant={mockSetApplicant}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox', {name: 'Name:'}), {target: {value: 'Jane Doe'}});

    expect(mockSetApplicant).toHaveBeenCalledWith(expect.anything());
  });

  it("navigates to /applicants/1/invite/add when the button is clicked", () => {
    render(
      <MemoryRouter>
        <ApplicantPersonalCardContainer
          applicant={mockApplicant}
          setApplicant={mockSetApplicant}
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {name: 'Invite'});
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/applicants/1/invite/add");
  });
});
