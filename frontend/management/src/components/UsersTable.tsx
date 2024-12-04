import {UserInterface} from "../utils/types";
import TableBodyContainer from "../containers/TableBodyContainer.tsx";
import TableHeadContainer from "../containers/TableHeadContainer.tsx";
import {userColumns} from "../utils/constants.tsx";
import React from "react";

function UsersTable({ data, setOrderBy }: Props) {
  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={userColumns} setOrderBy={setOrderBy} />
        <TableBodyContainer columns={userColumns} tableData={data} />
      </table>
    </>
  );
}

interface Props {
  data: UserInterface[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default UsersTable;
