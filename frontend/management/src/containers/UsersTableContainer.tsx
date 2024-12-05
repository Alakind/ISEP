import React from "react";
import UsersTable from "../components/UsersTable.tsx";
import {UserInterface} from "../utils/types.tsx";

function UsersTableContainer({ data, setOrderBy }: Props) {
  return (
    <UsersTable data={data} setOrderBy={setOrderBy} />
  )
}

interface Props {
  data: UserInterface[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default UsersTableContainer
