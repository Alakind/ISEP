import {useState} from 'react'
import BulkActionSelect from "../components/BulkActionSelect.tsx";
import {deleteUser} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Selection} from "../utils/types.tsx";
import CustomWarnToast from "../components/CustomWarnToast.tsx";

function BulkActionSelectContainer({isSelected} : Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("-")
  const options: string[] = ["-","Delete selected"];

  function proceedAction() {
    deleteUsers();
  }

  function cancelAction() {
    setLoading(false);
  }

  async function deleteUsers() {
    try {
      for (let i = 0; i < isSelected.length; i++) {
        if (isSelected[i].checked) {
          await deleteUser(isSelected[i].id);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleSelect(e: { preventDefault: () => void; target: { value: string; }; }) {
    e.preventDefault();

    if (e.target.value == "Delete selected") {
      setLoading(true);
      
      if (isSelected.some((selection) => selection.checked)) {
        toast.warn(<CustomWarnToast proceedAction={proceedAction} cancelAction={cancelAction} message={"Are you sure you want to delete these users? State can't be" +
          " restored!"}/>, {hideProgressBar: true, autoClose: false,});
      } else {
        toast.info("You need to select some users for this action!");
        setLoading(false);
      }

      e.target.value = "-";
      setSelectedOption("-");
    }
  }

  return (
    <BulkActionSelect loading={loading} options={options} handleSelect={handleSelect} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
  )
}

interface Props {
  isSelected: Selection[]
}

export default BulkActionSelectContainer
