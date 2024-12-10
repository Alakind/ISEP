import {useNavigate} from "react-router-dom";
import ApplicantInvite from "../../components/applicant-invite/ApplicantInvite.tsx";

function ApplicantInviteContainer({} : Props) {
  const navigate = useNavigate();

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };

  return (
    <ApplicantInvite goToApplicantsPage={goToApplicantsPage} />
  );
}

interface Props {

}
export default ApplicantInviteContainer
