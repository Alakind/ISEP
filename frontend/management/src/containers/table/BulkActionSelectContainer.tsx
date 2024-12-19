import {ChangeEvent, ReactNode, useState} from 'react'
import BulkActionSelect from "../../components/table/BulkActionSelect.tsx";
import {deleteUser} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Selection} from "../../utils/types.tsx";
import CustomWarnToast from "../../components/CustomWarnToast.tsx";

function BulkActionSelectContainer({isSelected, removeUser}: Props): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("-");
  const options: string[] = ["-", "Delete selected"];

  function proceedAction(): void {
    deleteUsers().then();
  }

  function cancelAction(): void {
    setLoading(false);
  }

  async function deleteUsers(): Promise<void> {
    try {
      for (let i: number = 0; i < isSelected.length; i++) {
        if (isSelected[i].checked) {
          await deleteUser(isSelected[i].id);
          removeUser(isSelected[i].id);
        }
      }
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

  async function handleSelect(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    e.preventDefault();

    if (e.target.value == "Delete selected") {
      setLoading(true);

      if (isSelected.some((selection: Selection): boolean => selection.checked)) {
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
  isSelected: Selection[];
  removeUser: (id: string) => void;
}

export default BulkActionSelectContainer
