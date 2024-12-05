import { useNavigate, useParams } from "react-router-dom";

import { ApplicantInterface } from "../utils/types";
import ApplicantPage from "../components/ApplicantPage";
import {PreferredLanguages} from "../utils/constants.tsx";

function ApplicantPageContainer() {
  const { id } = useParams();
  console.log(`Applicant's Id is ${id}`);

  const navigate = useNavigate();

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };

  const applicant: ApplicantInterface = {
    name: "Sasha Surname",
    id: "1234567890",
    email: "Sasha@email.com",
    score: 100,
    status: "AppInvitedStart",
    preferredLanguage: PreferredLanguages.JAVA
  };

  return (
    <ApplicantPage
      applicant={applicant}
      goToApplicantsPage={goToApplicantsPage}
    />
  );
}

export default ApplicantPageContainer;
