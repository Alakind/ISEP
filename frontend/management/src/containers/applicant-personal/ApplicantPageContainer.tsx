import { useNavigate, useParams } from "react-router-dom";
import {ApplicantInterface, InviteInterface} from "../../utils/types.tsx";
import ApplicantPage from "../../components/applicant-personal/ApplicantPage.tsx";
import {useEffect, useState} from "react";
import {getApplicant, getInvite} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../components/LoadingPage.tsx";

function ApplicantPageContainer() {
  const [applicantData, setApplicantData] = useState<ApplicantInterface>({id: "0", name: "", email: "", status: "", preferredLanguage: "", score: 0, invite: "" });
  const [assessmentId, setAssessmentId] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  async function getInviteData(inviteId: string): Promise<void> {
    setLoading(true);
    try {
      if (inviteId !== undefined) {
        const data: InviteInterface = await getInvite(inviteId)
        setAssessmentId(data.assessmentId);
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  async function getData() {
    setLoading(true);
    try {
      if (id !== undefined) {
        const data = await getApplicant(id);
        setApplicantData(data);
        if (data.invite !== undefined) {
          await getInviteData(data.invite);
        }
      }
    } catch (error: any) {
      toast.error(error.message)
      navigate(`/applicants`);
    } finally {
      setLoading(false);
    }
  }

  const goToApplicantsPage = (): void => {
    navigate(`/applicants`);
  };


  if (loading || applicantData.id == "0") {
    return <LoadingPage />;
  } else {
    return (
      <ApplicantPage
        applicant={applicantData}
        setApplicant={setApplicantData}
        goToApplicantsPage={goToApplicantsPage}
        assessmentId={assessmentId}
      />
    );
  }
}

export default ApplicantPageContainer;
