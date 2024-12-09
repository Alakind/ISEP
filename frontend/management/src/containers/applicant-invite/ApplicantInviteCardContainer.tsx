import {useEffect, useState} from "react";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {getApplicant, getAssessments, inviteApplicant} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ApplicantInviteCard from "../../components/applicant-invite/ApplicantInviteCard.tsx";

function ApplicantInviteCardContainer() {
  const [inviteData, setInviteData] = useState<InviteInterface>({applicantId: "0", assessmentId: "0" });
  const [applicantData, setApplicantData] = useState<ApplicantInterface>({id: "0", name: "", email: "", status: "", preferredLanguage: "", score: 0, invite: "" });
  const [assessmentsData, setAssessmentsData] = useState<AssessmentInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getData();
      getAssessmentsData();
    }
  }, [id]);

  async function getData() {
    setLoading(true);
    try {
      if (id !== undefined) {
        const data: ApplicantInterface = await getApplicant(id);
        setApplicantData(data);
        setInviteData((prev: InviteInterface): InviteInterface => ({
          ...prev,
          applicantId: data.id,
        }));
      } else {
        toast.error("Couldn't retrieve applicant.");
      }
    } catch (error: any) {
      toast.error(error.message)
      handleCancel();
    } finally {
      setLoading(false);
    }
  }

  async function getAssessmentsData() {
    setLoading(true);
    try {
      const data: {data: AssessmentInterface[], totalItems: number} = await getAssessments();
      setAssessmentsData(data.data);
    } catch (error: any) {
      toast.error(error.message)
      handleCancel();
    } finally {
      setLoading(false);
    }
  }

  const goToApplicantPage = (): void => {
    navigate(`/applicants/${id}/info`);
  };

  async function handleInvite() {
    try {
      const res = await inviteApplicant(inviteData.applicantId, inviteData.assessmentId); //
      setInviteData(res.data);
      toast.success("Successfully added applicant!");
      goToApplicantPage();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;

    setInviteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCancel() {
    navigate("/applicants");
  }

  //Get assessments

  return (
    <ApplicantInviteCard
      applicantData={applicantData}
      handleInvite={handleInvite}
      handleCancel={handleCancel}
      handleChange={handleChange}
      assessmentsData={[]}    />
  );
}

export default ApplicantInviteCardContainer
