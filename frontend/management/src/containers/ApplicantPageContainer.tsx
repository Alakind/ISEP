import { useNavigate, useParams } from "react-router-dom";
import { ApplicantInterface } from "../utils/types";
import ApplicantPage from "../components/ApplicantPage";
import {useEffect, useState} from "react";
import {getApplicant} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../components/LoadingPage.tsx";

function ApplicantPageContainer() {
  const [applicantData, setApplicantData] = useState<ApplicantInterface>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

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

export default ApplicantPageContainer;
