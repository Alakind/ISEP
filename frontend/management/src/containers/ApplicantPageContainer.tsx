import { useNavigate, useParams } from "react-router-dom";

import { ApplicantInterface } from "../utils/types";
import ApplicantPage from "../components/ApplicantPage";

function ApplicantPageContainer() {
  const { id } = useParams();
  console.log(`Applicant's Id is ${id}`);

  const navigate = useNavigate();

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };

  const applicant: ApplicantInterface = {
    name: "Sasha",
    surname: "Surname",
    id: "1234567890",
  };

  return (
    <ApplicantPage
      applicant={applicant}
      goToApplicantsPage={goToApplicantsPage}
    />
  );
}

export default ApplicantPageContainer;
