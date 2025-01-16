import TableBody from "../../../src/components/table/TableBody.tsx";
import {ApplicantInterface, Column, Selection, UserInterface} from "../../../src/utils/types.tsx";
import {render, screen} from "@testing-library/react";
import {applicantColumns, Roles, userColumns} from "../../../src/utils/constants.tsx";

describe('TableBody Component', () => {
  const mockUserColumns: Column[] = userColumns;

  const mockApplicantColumns: Column[] = applicantColumns;

  const mockUserData: UserInterface[] = [
    {createdAt: undefined, id: '1', name: 'User 1', email: 'user1@example.com', role: Roles.ADMIN},
    {createdAt: undefined, id: '2', name: 'User 2', email: 'user2@example.com', role: Roles.INTERVIEWER},
  ];

  const mockApplicantData: ApplicantInterface[] = [
    {createdAt: undefined, id: '3', name: 'Applicant 1', email: 'applicant1@example.com', scores: [85], preferredLanguage: "Kotlin", statuses: ['Invited'], invites: []},
    {createdAt: undefined, id: '4', name: 'Applicant 2', email: 'applicant2@example.com', scores: [90], preferredLanguage: "Kotlin", statuses: ['Completed'], invites: []},
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
    expect(screen.getByText('85/100')).toBeInTheDocument();

    expect(screen.getByText('Applicant 2')).toBeInTheDocument();
    expect(screen.getByText('applicant2@example.com')).toBeInTheDocument();
    expect(screen.getByText('90/100')).toBeInTheDocument();
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