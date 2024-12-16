import {Selection, UserInterface} from "../../utils/types.tsx";
import TableBodyContainer from "../../containers/table/TableBodyContainer.tsx";
import TableHeadContainer from "../../containers/table/TableHeadContainer.tsx";
import {userColumns} from "../../utils/constants.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import "../../styles/table.css";

function UsersTable({ data, orderBy, setOrderBy, setIsSelected, isSelected }: Props): ReactNode {
  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={userColumns} setOrderBy={setOrderBy} setIsSelected={setIsSelected} orderBy={orderBy} />
        <TableBodyContainer columns={userColumns} tableData={data} setIsSelected={setIsSelected} isSelected={isSelected}/>
      </table>
    </>
  );
}

interface Props {
  data: UserInterface[];
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setIsSelected: Dispatch<SetStateAction<Selection[]>>;
  isSelected: Selection[];
}

export default UsersTable;
