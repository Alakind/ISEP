import TableBody from "../../components/table/TableBody.tsx";
import {Selection, ApplicantInterface, Column, UserInterface} from "../../utils/types.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Dispatch, ReactNode, SetStateAction} from "react";

function TableBodyContainer({ columns, tableData, setIsSelected, isSelected } : Props): ReactNode {
  const navigate: NavigateFunction = useNavigate();

  function goToApplicantPage(applicantId: string): void {
    navigate(`/applicants/${applicantId}/info`);
  }

  function handleSelect(id: string): void {
    if (setIsSelected) {
      setIsSelected((prevState: Selection[]): Selection[] => {
        return prevState.map((item: Selection): Selection =>
          item.id === id ? {...item, checked: !item.checked} : item
        );
      });
    }
  }

  return (
    <TableBody columns={columns} tableData={tableData} goToApplicantPage={goToApplicantPage} handleSelect={handleSelect} isSelected={isSelected ?? []}/>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[];
  setIsSelected?: Dispatch<SetStateAction<Selection[]>>;
  isSelected?: Selection[];
}

export default TableBodyContainer
