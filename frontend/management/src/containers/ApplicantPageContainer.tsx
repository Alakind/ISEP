import { useNavigate, useParams } from "react-router-dom";
import { ApplicantInterface } from "../utils/types";
import ApplicantPage from "../components/ApplicantPage";
import {PreferredLanguages} from "../utils/constants.tsx";
import {useEffect, useState} from "react";
import {getApplicant} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../components/LoadingPage.tsx";

function ApplicantPageContainer({applicant} : Props) {
  const [applicantData, setApplicantData] = useState<ApplicantInterface | null>(applicant || null);
  const [loading, setLoading] = useState<boolean>(!applicant);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!applicant && id) {
      getData();
    }
  }, [applicant, id]);

  async function getData() {
    setLoading(true);
    try {
      if (id !== undefined) {
        const data = await getApplicant(id);
        setApplicantData(data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };


  if (loading || !applicantData) {
    return <LoadingPage />;
  } else {
    return (
      <ApplicantPage
        applicant={applicantData}
        goToApplicantsPage={goToApplicantsPage}
      />
    );
  }
}

interface Props {
  applicant?: ApplicantInterface;
}

export default ApplicantPageContainer;
