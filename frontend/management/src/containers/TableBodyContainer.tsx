import TableBody from "../components/TableBody.tsx";
import {Selection, ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";
import {useNavigate} from "react-router-dom";
import React from "react";

function TableBodyContainer({ columns, tableData, setIsSelected, isSelected } : Props) {
  const navigate = useNavigate();

  const goToApplicantPage = (applicantId: string): void => {
    navigate(`/applicants/${applicantId}/info`);
  };

  const handleSelect = (id: string) => {
    if (setIsSelected) {
      setIsSelected((prevState: Selection[]) => {
        return prevState.map((item) =>
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
  setIsSelected?: React.Dispatch<React.SetStateAction<Selection[]>>;
  isSelected?: Selection[];
}

export default TableBodyContainer
