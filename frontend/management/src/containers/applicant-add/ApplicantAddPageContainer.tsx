import {useNavigate} from "react-router-dom";
import ApplicantAddPage from "../../components/applicant-add/ApplicantAddPage.tsx";
import {ReactNode} from "react";
import CardPageContainer from "../card/CardPageContainer.tsx";

function ApplicantAddPageContainer(): ReactNode {
  const navigate = useNavigate();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  return (
    <CardPageContainer>
      <ApplicantAddPage goToApplicantsPage={goToApplicantsPage}/>
    </CardPageContainer>
  );
}

export default ApplicantAddPageContainer
