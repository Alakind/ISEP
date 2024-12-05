import {Selection, UserInterface} from "../utils/types";
import TableBodyContainer from "../containers/TableBodyContainer.tsx";
import TableHeadContainer from "../containers/TableHeadContainer.tsx";
import {userColumns} from "../utils/constants.tsx";
import React from "react";

function UsersTable({ data, setOrderBy, setIsSelected, isSelected }: Props) {
  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={userColumns} setOrderBy={setOrderBy} setIsSelected={setIsSelected} />
        <TableBodyContainer columns={userColumns} tableData={data} setIsSelected={setIsSelected} isSelected={isSelected}/>
      </table>
    </>
  );
}

interface Props {
  data: UserInterface[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setIsSelected: React.Dispatch<React.SetStateAction<Selection[]>>;
  isSelected: Selection[];
}

export default UsersTable;
