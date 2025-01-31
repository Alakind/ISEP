import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {toast} from 'react-toastify';
import SolvedAssignmentContainer from "../../../../src/containers/applicant-personal/results/SolvedAssignmentContainer.tsx";
import {AssignmentSolvedInterface} from "../../../../src/utils/types.tsx";
import {AssignmentTypes, Roles} from "../../../../src/utils/constants.tsx";
import {updateScoredPointsAssignment} from "../../../../src/utils/apiFunctions.tsx";
import {useUserData} from "../../../../src/utils/msal/UseUserData.tsx";

vi.mock('react-toastify', () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../../../src/utils/apiFunctions.tsx', () => ({
  updateScoredPointsAssignment: vi.fn(),
}));

vi.mock("../../../../src/utils/msal/UseUserData.tsx", () => ({
  useUserData: vi.fn(() => ({role: Roles.ADMIN})),
}))

const mockAssignment: AssignmentSolvedInterface = {
  type: AssignmentTypes.OPEN,
  description: "This is a question",
  id: '123',
  availablePoints: 100,
  scoredPoints: 50,
};

describe('SolvedAssignmentContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render SolvedAssignment with correct props', () => {
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should show a warning toast when input value is less than 0', () => {
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '-10'}});

    expect(toast.warning).toHaveBeenCalledWith(
      'Value must be greater than 0 and less than max value!'
    );
    expect(input).toHaveValue(0);
  });

  it('should show a warning toast when input value is greater than max', () => {
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '150'}});

    expect(toast.warning).toHaveBeenCalledWith(
      'Value must be greater than 0 and less than max value!'
    );
    expect(input).toHaveValue(mockAssignment.availablePoints);
  });

  it('should call updateScore when valid input is provided', async () => {
    vi.mocked(updateScoredPointsAssignment).mockResolvedValueOnce("Successfully updated score");

    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '80'}});

    await waitFor(() => {
      expect(updateScoredPointsAssignment).toHaveBeenCalledWith(mockAssignment.id, 80, 'invite123');
    });
  });

  it('should show an error toast if updateScore fails', async () => {
    vi.mocked(updateScoredPointsAssignment).mockRejectedValueOnce(
      new Error('Failed to update score')
    );

    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '80'}});

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update score');
    });
  });

  it('should handle unknown errors gracefully', async () => {
    vi.mocked(updateScoredPointsAssignment).mockRejectedValueOnce('Unknown error');

    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '80'}});

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unknown error occurred.');
    });
  });

  it('should not render score update field with Recruiter role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({id: "", name: "", oid: "", role: Roles.RECRUITER, email: ""})
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });


  it('should render score update field with Interviewer role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({id: "", name: "", oid: "", role: Roles.INTERVIEWER, email: ""})
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    expect(screen.queryByRole('spinbutton')).toBeInTheDocument();
  });

  it('should render score update field with Admin role', () => {
    vi.mocked(useUserData).mockReturnValueOnce({id: "", name: "", oid: "", role: Roles.ADMIN, email: ""})
    render(
      <SolvedAssignmentContainer
        assignment={mockAssignment}
        assignmentIndex={0}
        sectionIndex={0}
        inviteId={'invite123'}
      >
        <div>Child Component</div>
      </SolvedAssignmentContainer>
    );

    expect(screen.queryByRole('spinbutton')).toBeInTheDocument();
  });
});
