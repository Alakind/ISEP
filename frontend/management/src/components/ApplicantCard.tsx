import { ApplicantInterface } from "../utils/types";

function ApplicantCard({ applicant, goToApplicantPage }: ApplicantCardProps) {
  return (
    <div>
      <div onClick={() => goToApplicantPage(applicant.id)}>
        {applicant.name}
      </div>
    </div>
  );
}

interface ApplicantCardProps {
  applicant: ApplicantInterface;
  goToApplicantPage: (arg0: string) => void;
}

export default ApplicantCard;
