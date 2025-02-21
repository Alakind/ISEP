import TableBody from "../../components/table/TableBody.tsx";
import {ApplicantInterface, Column, InviteInterface, Selection, UserInterface} from "../../utils/types.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Dispatch, ReactNode, SetStateAction} from "react";

function TableBodyContainer({columns, tableData, setIsSelected, isSelected, additionalData}: Readonly<Props>): ReactNode {
  const navigate: NavigateFunction = useNavigate();

  function goToApplicantPage(applicantId: string): void {
    navigate(`/applicants/${applicantId}/info`);
  }

  function handleSelect(id: string): void {
    setIsSelected?.((prevState: Selection[]): Selection[] => {
      const item: Selection | undefined = prevState.find((item: Selection): boolean => item.id === id);

      if (!item) return prevState;

      const updatedItem = {...item, checked: !item.checked};
      if (updatedItem.checked === item.checked) return prevState;

      return prevState.map((item: Selection): Selection => (item.id === id ? updatedItem : item));
    });
  }

  return (
    <TableBody
      columns={columns}
      tableData={tableData}
      goToApplicantPage={goToApplicantPage}
      handleSelect={handleSelect}
      isSelected={isSelected ?? []}
      additionalData={additionalData}
    />
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[] | InviteInterface[];
  setIsSelected?: Dispatch<SetStateAction<Selection[]>>;
  isSelected?: Selection[];
  additionalData?: ApplicantInterface[];
}

export default TableBodyContainer
