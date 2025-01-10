import InvitesOverview from "../../../src/components/applicant-personal/InvitesOverview.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import {AssessmentInterface, InviteInterface} from "../../../src/utils/types.tsx";
import {mapStatus} from "../../../src/utils/mapping.tsx";
import {vi} from "vitest";

const mockInvitesData: InviteInterface[] = [
  {
    id: "cce487c0-9ff7-47a8-9844-b406e046459b",
    applicantId: "90",
    assessmentId: "3",
    status: "not_started",
    invitedAt: "2024-12-30T00:28:25.485108Z",
    expiresAt: "2025-01-06T00:28:25.485108Z"
  },
  {
    id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
    applicantId: "90",
    assessmentId: "4",
    status: "app_finished",
    invitedAt: "2024-12-30T00:28:25.485638Z",
    expiresAt: "2025-01-06T00:28:25.485638Z"
  }
];

const mockHandleCancel = vi.fn();
const mockHandleDelete = vi.fn();
const mockHandleRemind = vi.fn();

const mockAssessmentsData: AssessmentInterface[] = [
  {id: '3', tag: 'JAVA assessment', sections: [5, 6]},
  {id: '4', tag: 'SQL assessment', sections: [7, 8]},
];

describe('InvitesOverview component', () => {
  const mockHandleChangeExpirationDate = vi.fn();
  const mockExpirationDates = ['2024-12-31', '2024-12-30'];

  it('renders invites overview header', () => {
    render(
      <InvitesOverview
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        handleChangeExpirationDate={mockHandleChangeExpirationDate}
        expirationDates={mockExpirationDates}
        handleCancel={mockHandleCancel}
        handleDelete={mockHandleDelete}
        handleRemind={mockHandleRemind}
      />
    );

    const container = screen.getByTestId(/invites-overview/i);
    expect(container).toBeInTheDocument();
  });

  it('renders invites when data is available', () => {
    render(
      <InvitesOverview
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        handleChangeExpirationDate={mockHandleChangeExpirationDate}
        expirationDates={mockExpirationDates}
        handleCancel={mockHandleCancel}
        handleDelete={mockHandleDelete}
        handleRemind={mockHandleRemind}
      />
    );

    const inviteItems = screen.getAllByTestId('status-item');
    expect(inviteItems).toHaveLength(mockInvitesData.length);

    mockInvitesData.forEach((invite, index) => {
      const statusItem = inviteItems[index];
      expect(statusItem).toHaveTextContent(mapStatus(invite.status));
    });
  });

  it('renders no invites message when no data is available', () => {
    render(
      <InvitesOverview
        invitesData={[]}
        assessmentsData={[]}
        handleChangeExpirationDate={mockHandleChangeExpirationDate}
        expirationDates={[]}
        handleCancel={mockHandleCancel}
        handleDelete={mockHandleDelete}
        handleRemind={mockHandleRemind}
      />
    );

    const noInvitesMessage = screen.getByText(/no invites available/i);
    expect(noInvitesMessage).toBeInTheDocument();
  });

  it('renders expiration date inputs with correct values', () => {
    render(
      <InvitesOverview
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        handleChangeExpirationDate={mockHandleChangeExpirationDate}
        expirationDates={mockExpirationDates}
        handleCancel={mockHandleCancel}
        handleDelete={mockHandleDelete}
        handleRemind={mockHandleRemind}
      />
    );

    const dateInputs = screen.getAllByLabelText(/available till/i);
    expect(dateInputs).toHaveLength(mockInvitesData.length);

    dateInputs.forEach((input, index) => {
      expect(input).toHaveValue(mockExpirationDates[index]);
    });
  });

  it('calls handleChangeExpirationDate when an expiration date is changed', () => {
    render(
      <InvitesOverview
        invitesData={mockInvitesData}
        assessmentsData={mockAssessmentsData}
        handleChangeExpirationDate={mockHandleChangeExpirationDate}
        expirationDates={mockExpirationDates}
        handleCancel={mockHandleCancel}
        handleDelete={mockHandleDelete}
        handleRemind={mockHandleRemind}
      />
    );

    const dateInputs = screen.getAllByLabelText(/available till/i);
    fireEvent.change(dateInputs[0], {target: {value: '2025-01-01'}});

    expect(mockHandleChangeExpirationDate).toHaveBeenCalledWith(expect.anything(), 0);
  });
})