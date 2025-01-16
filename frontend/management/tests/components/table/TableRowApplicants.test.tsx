import TableRowApplicants from "../../../src/components/table/TableRowApplicants.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import {ApplicantInterface, Column} from "../../../src/utils/types.tsx";
import {InviteStatuses} from "../../../src/utils/constants.tsx";

describe('TableRowApplicants Component', () => {
  const mockColumns: Column[] = [
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Statuses", accessor: "statuses", sortable: false},
    {label: "Score", accessor: "score", sortable: true},
    {label: "Unknown", accessor: "unknown", sortable: true},
  ]

  const mockData: ApplicantInterface = {
    createdAt: new Date(),
    id: '1',
    name: 'John Doe',
    scores: [75],
    preferredLanguage: "Kotlin",
    statuses: ['not_started', 'expired'],
    invites: ['invite_1', 'invite_2'],
    email: 'john.doe@example.com',
  };

  const mockGoToApplicantPage = vi.fn();

  it('renders the applicant name as a clickable link', () => {
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={mockData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const nameCell = screen.getByText('John Doe');
    expect(nameCell).toBeInTheDocument();
    fireEvent.click(nameCell);
    expect(mockGoToApplicantPage).toHaveBeenCalledWith('1');
  });

  it('renders the score with a progress bar', () => {
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={mockData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const scoreCell = screen.getByText('75/100');
    expect(scoreCell).toBeInTheDocument();

    const progressBar = screen.getByTestId('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveTextContent('(75%)');
  });

  it('renders the score with a progress bar when score is not present', () => {
    const noScoreData = {
      ...mockData,
      scores: undefined,
    };
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={noScoreData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const scoreCell = screen.getByText('0/100');
    expect(scoreCell).toBeInTheDocument();

    const progressBar = screen.getByTestId('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveTextContent('(0%)');
  });

  it('renders the statuses correctly', () => {
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={mockData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const statusItems = screen.getAllByTestId('status-item');
    expect(statusItems).toHaveLength(2);
    expect(statusItems[0]).toHaveTextContent(InviteStatuses.NOT_STARTED);
    expect(statusItems[1]).toHaveTextContent(InviteStatuses.EXPIRED);
  });

  it('renders fallback statuses if no statuses are present', () => {
    const noStatusesData = {
      ...mockData,
      statuses: [],
      invites: [],
    };

    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={noStatusesData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const fallbackStatus = screen.getByTestId('status-item');
    expect(fallbackStatus).toBeInTheDocument();
    expect(fallbackStatus).toHaveTextContent('Created');
  });

  it('renders fallback statuses if no invites are present', () => {
    const noStatusesData = {
      ...mockData,
      statuses: [],
    };

    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={noStatusesData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const fallbackStatuses = screen.getAllByTestId('status-item');
    fallbackStatuses.forEach((fallbackStatus) => {
      expect(fallbackStatus).toBeInTheDocument();
      expect(fallbackStatus).toHaveTextContent('Invited');
    })
  });

  it('renders generic column values for email', () => {
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={mockData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    const emailCell = screen.getByText('john.doe@example.com');
    expect(emailCell).toBeInTheDocument();
  });

  it('renders table row cell with unknown accessor', () => {
    render(
      <table>
        <tbody>
        <TableRowApplicants
          data={mockData}
          columns={mockColumns}
          goToApplicantPage={mockGoToApplicantPage}
        />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('unknown-cell')).toBeInTheDocument();
  });
});