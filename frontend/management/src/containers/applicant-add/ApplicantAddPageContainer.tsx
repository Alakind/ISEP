import {useNavigate} from "react-router-dom";
import ApplicantAddPage from "../../components/applicant-add/ApplicantAddPage.tsx";
import {ReactNode} from "react";
import CardPageContainer from "../card/CardPageContainer.tsx";
import {Roles} from "../../utils/constants.tsx";
import PageNoAccess from "../PageNoAccess.tsx";
import {useUserData} from "../../utils/msal/UseUserData.tsx";

function ApplicantAddPageContainer(): ReactNode {
  const navigate = useNavigate();
  const user = useUserData();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  if (user.role === Roles.ADMIN || user.role == Roles.RECRUITER) {
    return (
      <CardPageContainer>
        <ApplicantAddPage goToApplicantsPage={goToApplicantsPage}/>
      </CardPageContainer>
    );
  } else {
    return <PageNoAccess/>
  }

}

export default ApplicantAddPageContainer
