import {ApplicantInterface, Column} from "../../utils/types.tsx";
import Progressbar from "../Progressbar.tsx";
import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {ReactNode} from "react";

function TableRowApplicants({data, columns, goToApplicantPage}: Props): ReactNode {
  return (
    <tr>
      {columns.map(({accessor}: Column): ReactNode => {
        if (accessor == "name") {
          return (
            <th className="table-row__link" key={accessor} scope="row" onClick={(): void => goToApplicantPage(data.id)}>
              {data.name}
            </th>
          );
        } else if (accessor == "score") {
          return <td key={accessor}><span className="table-row__score">{data.score ? data.score : 0}/100</span><Progressbar applicant={data}/></td>
        } else if (accessor == "status") {
          return <td key={accessor}><StatusItem status={mapStatus(data.status)}/></td>
        } else {
          const value: string | number | undefined = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
          return <td key={accessor}>{typeof value === "string" || typeof value === "number" ? value : "——"}</td>;
        }
      })}
    </tr>
  )
}

interface Props {
  data: ApplicantInterface;
  columns: Column[];
  goToApplicantPage: (id: string) => void;
}

export default TableRowApplicants
