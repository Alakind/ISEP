import {Dispatch, ReactNode, SetStateAction} from "react";
import UsersTable from "../../components/table/UsersTable.tsx";
import {Selection, UserInterface} from "../../utils/types.tsx";

function UsersTableContainer({data, orderBy, setOrderBy, setIsSelected, isSelected}: Props): ReactNode {
  return (
    <UsersTable data={data} setOrderBy={setOrderBy} setIsSelected={setIsSelected} isSelected={isSelected} orderBy={orderBy}/>
  )
}

interface Props {
  data: UserInterface[];
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setIsSelected: Dispatch<SetStateAction<Selection[]>>;
  isSelected: Selection[];
}

export default UsersTableContainer
