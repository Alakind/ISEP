import {useNavigate} from "react-router-dom";
import ApplicantAdd from "../../components/applicant-add/ApplicantAdd.tsx";

function ApplicantAddContainer({} : Props) {
  const navigate = useNavigate();

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };

  return (
    <ApplicantAdd goToApplicantsPage={goToApplicantsPage} />
  );
}

interface Props {
}

export default ApplicantAddContainer
