import ApplicantsTable from "../../../src/components/table/ApplicantsTable.tsx";
import {render, screen} from "@testing-library/react";
import {ApplicantInterface} from "../../../src/utils/types.tsx";
import {MemoryRouter} from "react-router-dom";

describe('ApplicantsTable component', () => {
  const mockApplicantData: ApplicantInterface[] = [
    {id: '3', name: 'Applicant 1', email: 'applicant1@example.com', score: 85, preferredLanguage: "Kotlin", statuses: ['Invited'], invites: []},
    {id: '4', name: 'Applicant 2', email: 'applicant2@example.com', score: 90, preferredLanguage: "Kotlin", statuses: ['Completed'], invites: []},
  ];

  const mockSetOrderBy = vi.fn();

  it('should render the applicant table with head and body', () => {
    render(
      <MemoryRouter>
        <ApplicantsTable data={mockApplicantData} orderBy={""} setOrderBy={mockSetOrderBy}/>
      </MemoryRouter>
    );

    expect(screen.getByTestId("applicants-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-head")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });
})