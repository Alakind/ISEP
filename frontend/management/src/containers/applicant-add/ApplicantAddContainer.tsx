import {useNavigate} from "react-router-dom";
import ApplicantAdd from "../../components/applicant-add/ApplicantAdd.tsx";
import {ReactNode} from "react";

function ApplicantAddContainer({} : Props): ReactNode {
  const navigate = useNavigate();

  function goToApplicantsPage(): void {
    navigate(`/applicants`);
  }

  return (
    <ApplicantAdd goToApplicantsPage={goToApplicantsPage} />
  );
}

interface Props {
}

export default ApplicantAddContainer
