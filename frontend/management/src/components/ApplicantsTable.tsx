import { ApplicantInterface } from "../utils/types";

function ApplicantsTable({
  applicants,
  goToApplicantPage,
}: ApplicantsTableProps) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        {applicants.map((applicant) => {
          return (
            <tbody>
              <tr>
                <th scope="row" onClick={() => goToApplicantPage(applicant.id)}>
                  {applicant.name + " " + applicant.surname}
                </th>
                <td>{applicant.email}</td>
                <td>{applicant.status}</td>
                <td>{applicant.score}/100</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </>
  );
}

interface ApplicantsTableProps {
  applicants: ApplicantInterface[];
  goToApplicantPage: (arg0: string) => void;
}

export default ApplicantsTable;
