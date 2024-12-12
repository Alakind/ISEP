import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {getApplicant, getAssessments, inviteApplicant} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ApplicantInviteCard from "../../components/applicant-invite/ApplicantInviteCard.tsx";
import LoadingPage from "../../components/LoadingPage.tsx";

function ApplicantInviteCardContainer(): ReactNode {
  const [inviteData, setInviteData] = useState<InviteInterface>({applicantId: "0", assessmentId: "0"});
  const [applicantData, setApplicantData] = useState<ApplicantInterface>({id: "0", name: "", email: "", status: "", preferredLanguage: "", score: 0, invite: ""});
  const [assessmentsData, setAssessmentsData] = useState<AssessmentInterface[]>([{id: "0", tag: "", sections: []}]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const {id} = useParams();
  const [selectedOption, setSelectedOption] = useState<number>(0);

  useEffect((): void => {
    if (id) {
      getData().then();
      getAssessmentsData().then();
    }
  }, [id]);

  async function getData(): Promise<void> {
    setLoading(true);
    try {
      if (id !== undefined) {
        const data: ApplicantInterface = await getApplicant(id);
        setApplicantData(data);
        setInviteData((prev: InviteInterface): InviteInterface => ({
          ...prev,
          applicantId: `${data.id}`,
        }));
      } else {
        toast.error("Couldn't retrieve applicant.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
      handleCancel();
    } finally {
      setLoading(false);
    }
  }

  async function getAssessmentsData(): Promise<void> {
    setLoading(true);
    try {
      const data: { data: AssessmentInterface[], totalItems: number } = await getAssessments();
      setAssessmentsData(data.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  function goToApplicantPage(): void {
    navigate(`/applicants/${id}/info`);
  }

  async function handleInvite(): Promise<void> {
    if (inviteData.applicantId != "0" && inviteData.assessmentId != "0") {
      try {
        await inviteApplicant(inviteData.applicantId, inviteData.assessmentId);
        goToApplicantPage();
        toast.success("Applicant successfully invited.");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      }
    } else {
      toast.error("Couldn't invite applicant, because the assessment could not be found.");
    }
  }

  function handleCancel(): void {
    goToApplicantPage();
  }

  function handleSelect(e: ChangeEvent<HTMLSelectElement>): void {
    const selectedId: number = Number(e.target.value);
    setSelectedOption(selectedId);

    setInviteData((prev: InviteInterface): InviteInterface => ({
      ...prev,
      assessmentId: `${selectedId}`,
    }));
  }

  if (loading) {
    return (<LoadingPage additionalClasses={"page--mod"}/>);
  } else {
    return (
      <ApplicantInviteCard
        applicantData={applicantData}
        handleInvite={handleInvite}
        handleCancel={handleCancel}
        assessmentsData={assessmentsData}
        handleSelect={handleSelect}
        selectedOption={selectedOption}
      />
    );
  }
}

export default ApplicantInviteCardContainer
