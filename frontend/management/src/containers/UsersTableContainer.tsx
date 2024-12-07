import React from "react";
import UsersTable from "../components/UsersTable.tsx";
import {Selection, UserInterface} from "../utils/types.tsx";

function UsersTableContainer({ data, orderBy, setOrderBy, setIsSelected, isSelected }: Props) {
  return (
    <UsersTable data={data} setOrderBy={setOrderBy} setIsSelected={setIsSelected} isSelected={isSelected} orderBy={orderBy}/>
  )
}

interface Props {
  data: UserInterface[];
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setIsSelected: React.Dispatch<React.SetStateAction<Selection[]>>;
  isSelected: Selection[];
}

export default UsersTableContainer
