import { ApplicantInterface } from "../utils/types";
import ApplicantsTable from "./ApplicantsTable";

function ApplicantsListPage({
  applicants,
  goToApplicantPage,
}: ApplicantsListProps) {
  return (
    <div>
      <ApplicantsTable
        applicants={applicants}
        goToApplicantPage={goToApplicantPage}
      />
    </div>
  );
}

interface ApplicantsListProps {
  applicants: ApplicantInterface[];
  goToApplicantPage: (arg0: string) => void;
}

export default ApplicantsListPage;
