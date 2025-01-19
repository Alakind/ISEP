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
    expiresAt: "2025-01-06T00:28:25.485108Z",
    measuredSecondsPerSection: [],
  },
  {
    id: "a543b334-2873-48b1-b5fb-64e9ab9df87b",
    applicantId: "90",
    assessmentId: "4",
    status: "app_finished",
    invitedAt: "2024-12-30T00:28:25.485638Z",
    expiresAt: "2025-01-06T00:28:25.485638Z",
    measuredSecondsPerSection: [],
    assessmentStartedAt: "2024-12-30T10:28:25.485638Z",
    assessmentFinishedAt: "2024-12-30T11:28:25.485638Z",
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
    expect(dateInputs).toHaveLength(mockInvitesData.length - 1); //app_finished will not show this

    dateInputs.forEach((input, index) => {
      expect(input).toHaveValue(mockExpirationDates[index]);
    });
  });

  it('renders finished at and started at', () => {
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

    const startedAt = screen.getByText(/Start date:/i);
    expect(startedAt.parentNode?.children[1]).toHaveTextContent("30/12/2024, 11:28:25");

    const finishedAt = screen.getByText(/Finish date:/i);
    expect(finishedAt.parentNode?.children[1]).toHaveTextContent("30/12/2024, 12:28:25");
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

  it('calls handleCancel when clicked', () => {
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

    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it('calls handleDelete when clicked', () => {
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

    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
  });

  it('calls handleRemind when clicked', () => {
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

    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    fireEvent.click(remindButton);

    expect(mockHandleRemind).toHaveBeenCalledTimes(1);
  });

  it('correct button disabled (status: not_started)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "not_started",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).not.toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
    expect(remindButton).not.toBeDisabled()
  });

  it('correct button disabled (status: cancelled)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "cancelled",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
    expect(remindButton).toBeDisabled()
  });

  it('correct button disabled (status: expired)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "expired",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
    expect(remindButton).toBeDisabled()
  });

  it('correct button disabled (status: app_reminded_once)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_reminded_once",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).not.toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
    expect(remindButton).not.toBeDisabled()
  });

  it('correct button disabled (status: app_reminded_twice)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_reminded_twice",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).not.toBeDisabled()
    expect(deleteButton).not.toBeDisabled()
    expect(remindButton).toBeDisabled()
  });

  it('correct button disabled (status: app_started)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_started",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
    expect(remindButton).toBeDisabled()
  });

  it('correct button disabled (status: app_finished)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "app_finished",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
    expect(remindButton).toBeDisabled()
  });

  it('correct button disabled (status: unknown)', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "cce487c0-9ff7-47a8-9844-b406e046459b",
        applicantId: "90",
        assessmentId: "3",
        status: "unknown",
        invitedAt: "2024-12-30T00:28:25.485108Z",
        expiresAt: "2025-01-06T00:28:25.485108Z",
        measuredSecondsPerSection: []
      }
    ];

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
    const cancelButton = screen.getAllByRole('button', {name: /cancel/i})[0]; // cancel button of first invite block
    const deleteButton = screen.getAllByRole('button', {name: /delete/i})[0]; // delete button of first invite block
    const remindButton = screen.getAllByRole('button', {name: /remind/i})[0]; // remind button of first invite block
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
    expect(remindButton).toBeDisabled()
  });
})