import ApplicantCard from "../../components/applicant-personal/ApplicantCard.tsx";
import {ApplicantInterface} from "../../utils/types.tsx";
import React, {useState} from "react";
import {toast} from "react-toastify";
import {deleteApplicant, updateApplicant} from "../../utils/apiFunctions.tsx";
import {useNavigate} from "react-router-dom";
import CustomWarnToast from "../../components/CustomWarnToast.tsx";

function ApplicantCardContainer({applicant, setApplicant} : Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [prevApplicantData, setPrevApplicantData] = useState<ApplicantInterface>(applicant);
  const navigate = useNavigate();

  function handleRemind() {
    //TODO implement mail reminder
  }

  function handleEdit() {
    setIsEditing(true);
  }

  async function handleDelete() {
    toast.warn(<CustomWarnToast proceedAction={proceedHandleDelete} cancelAction={cancelHandleDelete} message={"Are you sure you want to delete this applicant? The applicant can't be restored!"}/>, {hideProgressBar: true, autoClose: false,});
  }

  async function proceedHandleDelete() {
    try {
      const res = await deleteApplicant(applicant.id);
      toast.success(res);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPrevApplicantData({score: 0, status: "", id: "", name: "", email: "", preferredLanguage: "", invite: ""});
      setApplicant({score: 0, status: "", id: "", name: "", email: "", preferredLanguage: "", invite: ""});
      navigate(`/applicants`);
    }
  }

  function cancelHandleDelete() {
    toast.info("Applicant hasn't been deleted!")
  }

  function handleCancel() {
    setIsEditing(false);
    if (prevApplicantData) {
      setApplicant(prevApplicantData);
    } else {
      toast.error('No previous data to restore!');
    }
  }

  function handleReInvite() {
    //TODO implement mail resend invite
  }

  async function handleSave() {
    let res = {data: prevApplicantData};
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

  function handleChange(e: any) : void {
    const { name, value } = e.target;

    setApplicant((prev) => ({
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
  setApplicant: React.Dispatch<React.SetStateAction<ApplicantInterface>>;
}

export default ApplicantCardContainer
