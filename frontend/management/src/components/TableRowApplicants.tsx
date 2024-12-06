import {ApplicantInterface, Column} from "../utils/types.tsx";
import Progressbar from "./Progressbar.tsx";
import StatusItem from "./StatusItem.tsx";
import {ApplicantStatuses} from "../utils/constants.tsx";

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
          return <td key={accessor}><span className="table-row__score">{data.score}/100</span><Progressbar  applicant={data}/></td>
        } else if (accessor == typeof ApplicantStatuses) {
          return <td key={accessor}><StatusItem status={data.status}/></td>
        }  else {
          const value = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
          return <td key={accessor}>{typeof value === "string" || typeof value === "number" ? value : "——"}</td>;
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
