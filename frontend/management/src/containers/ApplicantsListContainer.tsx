import { useNavigate } from "react-router-dom";

import ApplicantsList from "../components/ApplicantsList";
import { ApplicantInterface } from "../utils/types";

function ApplicantsListContainer() {
  const navigate = useNavigate();

  const goToApplicantPage = (applicantId: string): void => {
    navigate(`/applicants/${applicantId}`);
  };

  const applicants: ApplicantInterface[] = [
    {
      name: "Sasha",
      surname: "Surname",
      id: "1234567890",
    },
    {
      name: "Everard",
      surname: "Surname",
      id: "234567890",
    },
    {
      name: "Jesse",
      surname: "Surname",
      id: "34567890",
    },
    {
      name: "Ruben",
      surname: "Surname",
      id: "4567890",
    },
    {
      name: "Jarno",
      surname: "Surname",
      id: "567890",
    },
  ];

  return (
    <ApplicantsList
      applicants={applicants}
      goToApplicantPage={goToApplicantPage}
    />
  );
}

export default ApplicantsListContainer;
