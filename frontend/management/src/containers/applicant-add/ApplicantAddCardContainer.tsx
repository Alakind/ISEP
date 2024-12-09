import {ApplicantInterface} from "../../utils/types.tsx";
import {useState} from "react";
import ApplicantAddCard from "../../components/ApplicantAddCard.tsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {addApplicant} from "../../utils/apiFunctions.tsx";

function ApplicantAddCardContainer({}: Props) {
  const emptyApplicantData: ApplicantInterface = {
    id: "0",
    name: "",
    email: "",
    status: "",
    preferredLanguage: ""};
  const [newApplicant, setNewApplicant] = useState<ApplicantInterface>(emptyApplicantData);
  const navigate = useNavigate();

  function handleCancel() {
    navigate("/applicants");
  }

  function clearFields() {
    setNewApplicant(emptyApplicantData)
  }

  async function handleAdd() {
    if (newApplicant.name != "" && newApplicant.email != "" && newApplicant.email.includes("@")) {
      try {
        const res = await addApplicant({name: newApplicant.name, email: newApplicant.email, preferredLanguage: newApplicant.preferredLanguage});
        setNewApplicant((prev) => ({
          ...prev,
          id: res.id,
        }));
        toast.success("Successfully added applicant!");
      } catch (error: any) {
        toast.error(error.message);
      }
      clearFields()
    } else {
      toast.info("Could not add applicant. Fill in the required fields and a valid email address.");
    }
  }

  async function handleAddInvite() {
    await handleAdd();
    navigate(`/applicant/${newApplicant.id}/invite/add`);
  }

  function handleChange(e: any) {
    const { name, value } = e.target;

    setNewApplicant((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <ApplicantAddCard
      newApplicant={newApplicant}
      handleCancel={handleCancel}
      handleAdd={handleAdd}
      handleAddInvite={handleAddInvite}
      handleChange={handleChange}
    />
  )
}

interface Props {
}

export default ApplicantAddCardContainer
