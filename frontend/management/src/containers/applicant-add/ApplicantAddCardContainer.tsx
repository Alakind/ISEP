import {ApplicantInterface} from "../../utils/types.tsx";
import {ChangeEvent, ReactNode, useState} from "react";
import ApplicantAddCard from "../../components/applicant-add/ApplicantAddCard.tsx";
import {toast} from "react-toastify";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {addApplicant} from "../../utils/apiFunctions.tsx";

function ApplicantAddCardContainer(): ReactNode {
  const emptyApplicantData: ApplicantInterface = {
    id: "0",
    name: "",
    email: "",
    preferredLanguage: ""
  };
  const [newApplicant, setNewApplicant] = useState<ApplicantInterface>(emptyApplicantData);
  const navigate: NavigateFunction = useNavigate();

  function handleCancel(): void {
    navigate("/applicants");
  }

  function clearFields() {
    setNewApplicant(emptyApplicantData)
  }

  async function handleAdd(goToInvite: boolean): Promise<void> {
    if (newApplicant.name != "" && newApplicant.email != "" && newApplicant.email.includes("@")) {
      try {
        const res: { id: string } = await addApplicant({name: newApplicant.name, email: newApplicant.email, preferredLanguage: newApplicant.preferredLanguage});
        setNewApplicant((prev: ApplicantInterface): ApplicantInterface => ({
          ...prev,
          id: res.id,
        }));
        toast.success("Successfully added applicant!");
        if (goToInvite) {
          navigate(`/applicants/${res.id}/invite/add`);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      }
      clearFields()
    } else {
      toast.info("Could not add applicant. Fill in the required fields and a valid email address.");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const {name, value} = e.target;

    setNewApplicant((prev: ApplicantInterface): ApplicantInterface => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <ApplicantAddCard
      newApplicant={newApplicant}
      handleCancel={handleCancel}
      handleAdd={handleAdd}
      handleChange={handleChange}
    />
  )
}

export default ApplicantAddCardContainer
