import ApplicantCard from "../../components/applicant-personal/ApplicantCard.tsx";
import {ApplicantInterface} from "../../utils/types.tsx";
import {ChangeEvent, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {toast} from "react-toastify";
import {deleteApplicant, updateApplicant} from "../../utils/apiFunctions.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import CustomWarnToast from "../../components/CustomWarnToast.tsx";

function ApplicantCardContainer({applicant, setApplicant} : Props): ReactNode {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [prevApplicantData, setPrevApplicantData] = useState<ApplicantInterface>(applicant);
  const navigate: NavigateFunction = useNavigate();

  function handleRemind(): void {
    //TODO implement mail reminder
  }

  function handleEdit(): void {
    setIsEditing(true);
  }

  async function handleDelete(): Promise<void> {
    toast.warn(<CustomWarnToast proceedAction={proceedHandleDelete} cancelAction={cancelHandleDelete} message={"Are you sure you want to delete this applicant? The applicant can't be restored!"}/>, {hideProgressBar: true, autoClose: false,});
  }

  async function proceedHandleDelete(): Promise<void> {
    try {
      const res: string = await deleteApplicant(applicant.id);
      toast.success(res);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPrevApplicantData({score: 0, status: "", id: "", name: "", email: "", preferredLanguage: "", invite: ""});
      setApplicant({score: 0, status: "", id: "", name: "", email: "", preferredLanguage: "", invite: ""});
      navigate(`/applicants`);
    }
  }

  function cancelHandleDelete(): void {
    toast.info("Applicant hasn't been deleted!")
  }

  function handleCancel(): void {
    setIsEditing(false);
    if (prevApplicantData) {
      setApplicant(prevApplicantData);
    } else {
      toast.error('No previous data to restore!');
    }
  }

  function handleReInvite(): void {
    //TODO implement mail resend invite
    navigate(`/applicants/${applicant.id}/invite/add`);
  }

  async function handleSave(): Promise<void> {
    let res: {data: ApplicantInterface} = {data: prevApplicantData};
    try {
      res = await updateApplicant(applicant.id, {name: applicant.name, email:applicant.email, preferredLanguage:applicant.preferredLanguage});
      toast.success("Successfully saved!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsEditing(false);
      setPrevApplicantData(res.data);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    setApplicant((prev: ApplicantInterface): ApplicantInterface => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <ApplicantCard
      isEditing={isEditing}
      applicant={applicant}
      handleRemind={handleRemind}
      handleEdit={handleEdit}
      handleReInvite={handleReInvite}
      handleDelete={handleDelete}
      handleCancel={handleCancel}
      handleSave={handleSave}
      handleChange={handleChange}
    />
  )
}

interface Props {
  applicant: ApplicantInterface;
  setApplicant: Dispatch<SetStateAction<ApplicantInterface>>;
}

export default ApplicantCardContainer
