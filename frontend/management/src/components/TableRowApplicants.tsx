import {ApplicantInterface, Column} from "../utils/types.tsx";

function TableRowApplicants({data, columns, goToApplicantPage} : Props ) {
  return (
    <tr>
      {columns.map(({ accessor }) => {
        if (accessor == "name") {
          return (
            <th className="table-row__link" key={accessor} scope="row" onClick={() => goToApplicantPage(data.id)}>
              {data.name}
            </th>
          );
        } else if (accessor == "score") {
          return <td key={accessor}>{data.score}/100</td>
        } else {
          const value: number | string = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
          return <td key={accessor}>{value}</td>;
        }
      })}
    </tr>
  )
}

interface Props {
  data: ApplicantInterface;
  columns: Column[];
  goToApplicantPage: (arg0: string) => void;
}

export default TableRowApplicants
