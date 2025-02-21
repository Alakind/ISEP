import {ChangeEvent, MouseEvent, ReactNode, useEffect, useState} from "react";
import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {addInvite, getApplicant, getAssessments, sendMail, updateApplicant} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ApplicantInviteCard from "../../components/applicant-invite/ApplicantInviteCard.tsx";
import LoadingPage from "../../components/LoadingPage.tsx";
import {EmailTypes} from "../../utils/constants.tsx";

function ApplicantInviteCardContainer(): ReactNode {
  const [inviteData, setInviteData] = useState<InviteInterface>({
    expiresAt: getExpirationDateFormatted(),
    id: "",
    invitedAt: "",
    status: "",
    applicantId: "0",
    assessmentId: "0",
    measuredSecondsPerSection: []
  });
  const [sendMailToggle, setSendMailToggle] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const [editingEmail, setEditingEmail] = useState<boolean>(false);
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [prevApplicantEmail, setPrevApplicantEmail] = useState<string>("");
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
        setApplicantEmail(data.email);
        setPrevApplicantEmail(data.email);
        setInviteData((prev: InviteInterface): InviteInterface => ({
            ...prev,
            applicantId: `${data.id}`,
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
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
      const data: { data: AssessmentInterface[], totalItems: number } =
        await getAssessments(0, -1, "", "tag,desc");
      setAssessmentsData(data.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
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
      let inviteId;
      try {
        inviteId = await addInvite(inviteData.applicantId, inviteData.assessmentId, inviteData.expiresAt);

        toast.success("Applicant successfully invited.");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error occurred.");
        }
      }
      if (sendMailToggle && inviteId !== undefined) {
        await handleMailing(inviteId)
      }
    } else {
      toast.error(
        "Couldn't invite applicant, because the assessment could not be found."
      );
    }
    goToApplicantPage();
  }

  async function handleMailing(inviteId: string): Promise<void> {
    try {
      await sendMail(inviteData.applicantId, inviteId, EmailTypes.INVITATION, message);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      toast.success("Successfully emailed invitation.");
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

    setInviteData(
      (prev: InviteInterface): InviteInterface => ({
        ...prev,
        assessmentId: `${selectedId}`,
      })
    );
  }

  function handleToggleMail(): void {
    if (sendMailToggle) {
      setEditingEmail(false);
    }
    setSendMailToggle(!sendMailToggle);
  }

  function getExpirationDateFormatted(inputDate?: string): string {
    const DEFAULT_EXPIRATION_DAYS: number = Number(import.meta.env.VITE_DEFAULT_EXPIRATION_DAYS) || 0;

    const date: Date = inputDate ? new Date(inputDate) : new Date();

    if (isNaN(date.getTime())) {
      throw new Error("Invalid input date format");
    }

    date.setDate(date.getDate() + DEFAULT_EXPIRATION_DAYS);

    const yyyy: number = date.getFullYear();
    const mm: string = String(date.getMonth() + 1).padStart(2, '0');
    const dd: string = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  function handleChangeExpirationDate(e: ChangeEvent<HTMLInputElement>): void {
    const selectedDate: number = new Date(e.target.value).setHours(0, 0, 0, 0);
    const today: number = new Date().setHours(0, 0, 0, 0);
    if (today > selectedDate) {
      toast.error("Select today or a day in the future.");
      return;
    }

    const isoDate: string = new Date(new Date(e.target.value).setUTCHours(23, 59)).toISOString();
    setInviteData((prev: InviteInterface): InviteInterface => ({
      ...prev,
      expiresAt: isoDate,
    }));
  }

  function handleChangeEmail(e: ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setApplicantEmail(e.target.value);
  }

  function handleEditingEmail(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (sendMailToggle) {
      if (editingEmail && prevApplicantEmail != applicantEmail) {
        handleSaveEmail().then();
      }
      setEditingEmail(!editingEmail);
    }

  }

  async function handleSaveEmail(): Promise<void> {
    let res: { email: string } = {email: prevApplicantEmail};
    try {
      const updatedApplicant: { data: Partial<ApplicantInterface> } = await updateApplicant(inviteData.applicantId, {email: applicantEmail});
      if (updatedApplicant.data.email) {
        res = {email: updatedApplicant.data.email};
      }
      toast.success("Email successfully updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setApplicantEmail(res.email);
    }
  }

  function handleCancelEditingEmail(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (sendMailToggle && editingEmail) {
      setEditingEmail(false);
      if (prevApplicantEmail) {
        setApplicantEmail(prevApplicantEmail);
      } else {
        toast.error('No previous data to restore!');
      }
    }
  }

  function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setMessage(e.currentTarget.value);
  }

  if (loading) {
    return <LoadingPage additionalClasses={"page--mod"}/>;
  } else {
    return (
      <ApplicantInviteCard
        applicantEmail={applicantEmail}
        handleInvite={handleInvite}
        handleCancel={handleCancel}
        assessmentsData={assessmentsData}
        handleSelect={handleSelect}
        selectedOption={selectedOption}
        handleToggleMail={handleToggleMail}
        handleChangeExpirationDate={handleChangeExpirationDate}
        inviteData={inviteData}
        toggleValue={sendMailToggle}
        handleChangeEmail={handleChangeEmail}
        editingEmail={editingEmail}
        handleEditingEmail={handleEditingEmail}
        handleCancelEditingEmail={handleCancelEditingEmail}
        handleMessageChange={handleMessageChange}
        message={message}
      />
    );
  }
}

export default ApplicantInviteCardContainer;
