import { ApplicantInterface } from "../utils/types";

function ApplicantPage({ applicant, goToApplicantsPage }: Props) {
  return (
    <div>
      <button onClick={goToApplicantsPage}>Back to all applicants</button>
      This is personal page of {applicant.name}
    </div>
  );
}

interface Props {
  applicant: ApplicantInterface;
  goToApplicantsPage: () => void;
}

export default ApplicantPage;
