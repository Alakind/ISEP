import TableBody from "../../../src/components/table/TableBody.tsx";
import {ApplicantInterface, Column, InviteInterface, Selection, UserInterface} from "../../../src/utils/types.tsx";
import {render, screen} from "@testing-library/react";
import {applicantColumns, dashboardExpiredColumns, dashboardFinishedColumns, dashboardWillExpireColumns, InviteStatuses, Roles, userColumns} from "../../../src/utils/constants.tsx";
import {mapStatus} from "../../../src/utils/mapping.tsx";

describe('TableBody Component', () => {
  const mockUserColumns: Column[] = userColumns;

  const mockApplicantColumns: Column[] = applicantColumns;

  const mockInvitesFinishedColumns: Column[] = dashboardFinishedColumns;

  const mockInvitesExpiredColumns: Column[] = dashboardExpiredColumns;

  const mockInvitesWillExpireColumns: Column[] = dashboardWillExpireColumns;


  const mockUserData: UserInterface[] = [
    {createdAt: undefined, id: '1', name: 'User 1', email: 'user1@example.com', role: Roles.ADMIN, oid: ""},
    {createdAt: undefined, id: '2', name: 'User 2', email: 'user2@example.com', role: Roles.INTERVIEWER, oid: ""},
  ];

  const mockApplicantData: ApplicantInterface[] = [
    {
      createdAt: undefined,
      id: '3',
      name: 'Applicant 1',
      email: 'applicant1@example.com',
      scores: [85],
      availablePoints: [124],
      preferredLanguage: "Kotlin",
      statuses: [mapStatus(InviteStatuses.NOT_STARTED)],
      invites: []
    },
    {
      createdAt: undefined,
      id: '4',
      name: 'Applicant 2',
      email: 'applicant2@example.com',
      scores: [90],
      availablePoints: [124],
      preferredLanguage: "Kotlin",
      statuses: [mapStatus(InviteStatuses.APP_FINISHED)],
      invites: []
    },
  ];

  const mockInvitesData: InviteInterface[] = [
    {
      id: "",
      applicantId: "3",
      assessmentId: "",
      status: mapStatus(InviteStatuses.APP_FINISHED),
      invitedAt: "",
      expiresAt: "2025-01-16T10:58:40Z",
      measuredSecondsPerSection: [],
      scoredPoints: 85,
      availablePoints: 124,
      assessmentFinishedAt: "2025-01-16T10:58:40Z",
    },
    {
      id: "",
      applicantId: "4",
      assessmentId: "",
      status: mapStatus(InviteStatuses.EXPIRED),
      invitedAt: "",
      expiresAt: "2025-01-21T10:58:40Z",
      measuredSecondsPerSection: [],
      scoredPoints: 90,
      availablePoints: 124,
      assessmentFinishedAt: "2025-01-17T10:58:40Z",
    },
  ];

  const mockHandleSelect = vi.fn();
  const mockGoToApplicantPage = vi.fn();
  const mockIsSelected: Selection[] = [{id: '1', checked: false}, {id: '2', checked: true}];

  it('renders user rows when user data is provided', async () => {
    render(
      <table>
        <TableBody
          columns={mockUserColumns}
          tableData={mockUserData}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
      </table>
    );

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByRole('option', {name: Roles.ADMIN, selected: true})).toBeInTheDocument();

    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByRole('option', {name: Roles.INTERVIEWER, selected: true})).toBeInTheDocument();
  });

  it('renders applicant rows when applicant data is provided', () => {
    render(
      <table>
        <TableBody
          columns={mockApplicantColumns}
          tableData={mockApplicantData}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
      </table>
    );

    expect(screen.getByText('Applicant 1')).toBeInTheDocument();
    expect(screen.getByText('applicant1@example.com')).toBeInTheDocument();
    expect(screen.getByText('85/124')).toBeInTheDocument();

    expect(screen.getByText('Applicant 2')).toBeInTheDocument();
    expect(screen.getByText('applicant2@example.com')).toBeInTheDocument();
    expect(screen.getByText('90/124')).toBeInTheDocument();
  });

  it('renders invites rows when invites data is provided for finished invites', () => {
    render(
      <table>
        <TableBody
          columns={mockInvitesFinishedColumns}
          tableData={[mockInvitesData[0]]}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
          additionalData={mockApplicantData}
        />
      </table>
    );

    expect(screen.getByText('Applicant 1')).toBeInTheDocument();
    expect(screen.getByText('applicant1@example.com')).toBeInTheDocument();
    expect(screen.getByText('85/124')).toBeInTheDocument();
    expect(screen.getByText('Thu, 16 Jan 2025 10:58:40 GMT')).toBeInTheDocument();
  });

  it('renders invites rows when invites data is provided for expired invites', () => {
    render(
      <table>
        <TableBody
          columns={mockInvitesExpiredColumns}
          tableData={[mockInvitesData[1]]}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
          additionalData={mockApplicantData}
        />
      </table>
    );

    expect(screen.getByText('Applicant 2')).toBeInTheDocument();
    expect(screen.getByText('applicant2@example.com')).toBeInTheDocument();
    // expect(screen.getByText('-4')).toBeInTheDocument();
  });

  it('renders invites rows when invites data is provided for will expire invites', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "",
        applicantId: "3",
        assessmentId: "",
        status: mapStatus(InviteStatuses.NOT_STARTED),
        invitedAt: "",
        expiresAt: "2025-01-16T10:58:40Z",
        measuredSecondsPerSection: [],
        scoredPoints: 85,
        availablePoints: 124,
        assessmentFinishedAt: "2025-01-16T10:58:40Z",
      },
    ];
    render(
      <table>
        <TableBody
          columns={mockInvitesWillExpireColumns}
          tableData={mockInvitesData}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
          additionalData={mockApplicantData}
        />
      </table>
    );

    expect(screen.getByText('Applicant 1')).toBeInTheDocument();
    expect(screen.getByText('applicant1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Assessment Not Started')).toBeInTheDocument();
    // expect(screen.getByText('-1')).toBeInTheDocument();

  });

  it('renders invites rows in loading state when applicant data is not provided', () => {
    const mockInvitesData: InviteInterface[] = [
      {
        id: "",
        applicantId: "3",
        assessmentId: "",
        status: mapStatus(InviteStatuses.NOT_STARTED),
        invitedAt: "",
        expiresAt: "2025-01-16T10:58:40Z",
        measuredSecondsPerSection: [],
        scoredPoints: 85,
        availablePoints: 124,
        assessmentFinishedAt: "2025-01-16T10:58:40Z",
      },
    ];
    render(
      <table>
        <TableBody
          columns={mockInvitesWillExpireColumns}
          tableData={mockInvitesData}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
      </table>
    );

    expect(screen.getAllByTestId('empty-cell')).toHaveLength(4);

  });

  it('calls goToApplicantPage when an applicant name is clicked', () => {
    render(
      <table>
        <TableBody
          columns={mockApplicantColumns}
          tableData={mockApplicantData}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
      </table>
    );

    const applicantName = screen.getByText('Applicant 1');
    applicantName.click();

    expect(mockGoToApplicantPage).toHaveBeenCalledWith('3');
  });

  it('renders no rows if tableData is empty', () => {
    render(
      <table>
        <TableBody
          columns={mockUserColumns}
          tableData={[]}
          goToApplicantPage={mockGoToApplicantPage}
          handleSelect={mockHandleSelect}
          isSelected={mockIsSelected}
        />
      </table>
    );

    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Applicant 1')).not.toBeInTheDocument();
  });
});