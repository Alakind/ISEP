import { useNavigate } from "react-router-dom";

import ApplicantsListPage from "../components/ApplicantsListPage";
import { ApplicantInterface } from "../utils/types";

function ApplicantsListContainer() {
  const navigate = useNavigate();

  const goToApplicantPage = (applicantId: string): void => {
    navigate(`/applicants/${applicantId}/info`);
  };

  const applicants: ApplicantInterface[] = [
    {
      name: "Sasha",
      surname: "Surname",
      id: "1234567890",
      email: "Sasha@email.com",
      score: 100,
      status: "AppInvitedStart",
    },
    {
      name: "Everard",
      surname: "Surname",
      id: "234567890",
      email: "Everard@email.com",
      score: 90,
      status: "AppInvitedStart",
    },
    {
      name: "Jesse",
      surname: "Surname",
      id: "34567890",
      email: "Jesse@email.com",
      score: 80,
      status: "AppInvitedStart",
    },
    {
      name: "Ruben",
      surname: "Surname",
      id: "4567890",
      email: "Ruben@email.com",
      score: 70,
      status: "AppInvitedStart",
    },
    {
      name: "Jarno",
      surname: "Surname",
      id: "567890",
      email: "Jarno@email.com",
      score: 60,
      status: "AppInvitedStart",
    },
  ];

  return (
    <ApplicantsListPage
      applicants={applicants}
      goToApplicantPage={goToApplicantPage}
    />
  );
}

export default ApplicantsListContainer;
