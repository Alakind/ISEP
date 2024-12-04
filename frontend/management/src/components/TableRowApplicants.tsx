import {ApplicantInterface, Column} from "../utils/types.tsx";

function TableRowApplicants({data, columns} : Props ) {
  return (
    <tr>
      {columns.map(({ accessor }) => {
        const value : number | string = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
        return <td key={accessor}>{value}</td>;
      })}
    </tr>
  )
}

interface Props {
  data: ApplicantInterface;
  columns: Column[];
}

export default TableRowApplicants
