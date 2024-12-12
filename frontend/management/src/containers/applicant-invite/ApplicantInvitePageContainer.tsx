import {NavigateFunction, useNavigate} from "react-router-dom";
import ApplicantInvitePage from "../../components/applicant-invite/ApplicantInvitePage.tsx";
import {ReactNode} from "react";
import CardPageContainer from "../card/CardPageContainer.tsx";

function ApplicantInvitePageContainer(): ReactNode {
  const navigate: NavigateFunction = useNavigate();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  return (
    <CardPageContainer>
      <ApplicantInvitePage goToApplicantsPage={goToApplicantsPage}/>
    </CardPageContainer>
  );
}

export default ApplicantInvitePageContainer
