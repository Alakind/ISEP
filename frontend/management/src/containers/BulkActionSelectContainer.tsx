import React, {useState} from 'react'
import BulkActionSelect from "../components/BulkActionSelect.tsx";
import {deleteUser} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Selection} from "../utils/types.tsx";

function BulkActionSelectContainer({isSelected} : Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const options: string[] = ["-","Delete selected"];

  async function deleteUsers() {

    try {
      for (let i = 0; i < isSelected.length; i++) {
        if (isSelected[i].checked) {
          console.log("blub")
          await deleteUser(isSelected[i].id);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleSelect(e) {
    e.preventDefault();
    if (e.target.value == "Delete selected") {
      setLoading(true);
      const Data = ({closeToast}) => {
        function proceedAction() {
          deleteUsers()
          closeToast;
        }

        function cancelAction() {
          closeToast;
          setLoading(false);
        }

        return (<div>
          Are you sure you want to delete these users? State can't be restored!
          <br/>
          <button onClick={proceedAction}>Yes</button>
          <button onClick={cancelAction}>No</button>
        </div>)
      }

      if (isSelected.some((selection) => selection.checked)) {
        toast.warn(<Data/>, {hideProgressBar: true, autoClose: false,});
      } else {
        toast.info("You need to select some users for this action!");
        setLoading(false);
      }
    }
  }

  return (
    <BulkActionSelect loading={loading} options={options} handleSelect={handleSelect}/>
  )
}

interface Props {
  isSelected: Selection[]
}

export default BulkActionSelectContainer
