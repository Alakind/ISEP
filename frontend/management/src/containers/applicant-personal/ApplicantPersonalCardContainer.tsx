import ApplicantPersonalCard from "../../components/applicant-personal/ApplicantPersonalCard.tsx";
import {ApplicantInterface} from "../../utils/types.tsx";
import {ChangeEvent, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {toast} from "react-toastify";
import {deleteApplicant, updateApplicant} from "../../utils/apiFunctions.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import CustomWarnToast from "../../components/CustomWarnToast.tsx";

function ApplicantPersonalCardContainer({applicant, setApplicant}: Readonly<Props>): ReactNode {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [prevApplicantData, setPrevApplicantData] = useState<ApplicantInterface>(applicant);
  const navigate: NavigateFunction = useNavigate();

  function handleEdit(): void {
    setIsEditing(true);
  }

  async function handleDelete(): Promise<void> {
    toast.warn(
      <CustomWarnToast
        proceedAction={proceedHandleDelete}
        cancelAction={cancelHandleDelete}
        message={"Are you sure you want to delete this applicant? The applicant can't be restored!"}
      />,
      {hideProgressBar: true, autoClose: false,}
    );
  }

  async function proceedHandleDelete(): Promise<void> {
    try {
      const res: string = await deleteApplicant(applicant.id);
      toast.success(res);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setPrevApplicantData({score: 0, statuses: [], id: "", name: "", email: "", preferredLanguage: "", invites: []});
      setApplicant({score: 0, statuses: [], id: "", name: "", email: "", preferredLanguage: "", invites: []});
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

  function handleInvite(): void {
    navigate(`/applicants/${applicant.id}/invite/add`);
  }

  async function handleSave(): Promise<void> {
    let res: { data: ApplicantInterface } = {data: prevApplicantData};
    try {
      const updatedApplicant: { data: Partial<ApplicantInterface> } = await updateApplicant(applicant.id, {
        name: applicant.name,
        email: applicant.email,
        preferredLanguage: applicant.preferredLanguage
      });
      res = {
        data: {
          ...prevApplicantData,
          ...updatedApplicant.data,
        },
      };
      toast.success("Successfully saved!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setIsEditing(false);
      setPrevApplicantData(res.data);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const {name, value} = e.target;

    setApplicant((prev: ApplicantInterface): ApplicantInterface => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <ApplicantPersonalCard
      isEditing={isEditing}
      applicant={applicant}
      handleEdit={handleEdit}
      handleInvite={handleInvite}
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

export default ApplicantPersonalCardContainer
