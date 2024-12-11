import {NavigateFunction, useNavigate} from "react-router-dom";
import ApplicantInvite from "../../components/applicant-invite/ApplicantInvite.tsx";
import {ReactNode} from "react";

function ApplicantInviteContainer({} : Props): ReactNode {
  const navigate: NavigateFunction = useNavigate();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  return (
    <ApplicantInvite goToApplicantsPage={goToApplicantsPage} />
  );
}

interface Props {

}
export default ApplicantInviteContainer
