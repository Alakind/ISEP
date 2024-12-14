import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {getApplicant, getAssessments, inviteApplicant} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ApplicantInviteCard from "../../components/applicant-invite/ApplicantInviteCard.tsx";
import LoadingPage from "../../components/LoadingPage.tsx";

function ApplicantInviteCardContainer(): ReactNode {
  const [inviteData, setInviteData] = useState<InviteInterface>({applicantId: "0", assessmentId: "0"});
  //TODO {applicantId: "0", assessmentId: "0", expirationDate: "2024-12-20", sendMail: false, message: ""}
  const [expirationDate, setExpirationDate] = useState<string>(getExpirationDate()); //TODO remove this when inviteData excepts expirationDate

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
    let selectedId: number;
    if (e.target.value != "default") {
      selectedId = Number(e.target.value);
    } else {
      selectedId = 0;
    }
    setSelectedOption(selectedId);

    setInviteData((prev: InviteInterface): InviteInterface => ({
      ...prev,
      assessmentId: `${selectedId}`,
    }));

    console.log(inviteData)
  }

  function handleToggleMail(checked: boolean): void {
    console.log(checked);
    //TODO uncomment when mails can be set
    // setInviteData((prev: InviteInterface): InviteInterface => ({
    //   ...prev,
    //   sentMail: `${checked}`,
    // }));
  }

  function getExpirationDate(): string {
    const today = new Date();
    const dd: string = String(today.getDate() + Number(import.meta.env.VITE_DEFAULT_EXPIRATION_DAYS)).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy: number = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  function handleChangeExpirationDate(e: ChangeEvent<HTMLInputElement>): void {
    const selectedDate: number = new Date(e.target.value).setHours(0, 0, 0, 0);
    const today: number = new Date().setHours(0, 0, 0, 0);
    if (today > selectedDate) {
      toast.error("Select today or a day in the future.");
      return;
    }
    setExpirationDate(e.target.value); //TODO temporary expiration date state
    // setInviteData((prev: InviteInterface): InviteInterface => ({
    //   ...prev,
    //   expirationDate: `${e.target.value}`,
    // }));
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
        handleToggleMail={handleToggleMail}
        expirationDate={expirationDate}
        handleChangeExpirationDate={handleChangeExpirationDate}
        inviteData={inviteData}
      />
    );
  }
}

export default ApplicantInviteCardContainer
