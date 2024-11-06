import { ApplicantInterface } from "../utils/types";

function ApplicantPage({ applicant, goToApplicantsPage }: ApplicantPageProps) {
  return (
    <div>
      <button onClick={goToApplicantsPage}>Back to all applicants</button>
      This is personal page of {applicant.name} {applicant.surname}
    </div>
  );
}

interface ApplicantPageProps {
  applicant: ApplicantInterface;
  goToApplicantsPage: () => void;
}

export default ApplicantPage;
