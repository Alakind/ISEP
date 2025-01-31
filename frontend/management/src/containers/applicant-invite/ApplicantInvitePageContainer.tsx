import {NavigateFunction, useNavigate} from "react-router-dom";
import ApplicantInvitePage from "../../components/applicant-invite/ApplicantInvitePage.tsx";
import {ReactNode} from "react";
import CardPageContainer from "../card/CardPageContainer.tsx";
import {Roles} from "../../utils/constants.tsx";
import {useUserData} from "../../utils/msal/UseUserData.tsx";
import PageNoAccess from "../PageNoAccess.tsx";

function ApplicantInvitePageContainer(): ReactNode {
  const navigate: NavigateFunction = useNavigate();
  const user = useUserData();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  if (user.role === Roles.ADMIN || user.role === Roles.RECRUITER) {
    return (
      <CardPageContainer>
        <ApplicantInvitePage goToApplicantsPage={goToApplicantsPage}/>
      </CardPageContainer>
    );
  } else {
    return <PageNoAccess/>
  }

}

export default ApplicantInvitePageContainer
