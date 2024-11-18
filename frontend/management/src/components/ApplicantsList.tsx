import { ApplicantInterface } from "../utils/types";
import ApplicantCard from "./ApplicantCard";

function ApplicantsList({
  applicants,
  goToApplicantPage,
}: ApplicantsListProps) {
  return (
    <div>
      {applicants.map((applicant) => {
        return (
          <ApplicantCard
            applicant={applicant}
            goToApplicantPage={goToApplicantPage}
            key={applicant.id}
          />
        );
      })}
    </div>
  );
}

interface ApplicantsListProps {
  applicants: ApplicantInterface[];
  goToApplicantPage: (arg0: string) => void;
}

export default ApplicantsList;
