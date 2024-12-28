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
        } else if (accessor == "statuses") {
          return (
            <td key={accessor} className={"block__status-item"}>
              {
                data.statuses && data.statuses.length != 0 ? data.statuses.map((status: string, index: number): ReactNode => (
                      <StatusItem key={`${status}_${index}`} status={mapStatus(status)}/>
                    )
                  ) :
                  data.invites && data.invites.length != 0 ? data.invites.map((invite: string, index: number): ReactNode => (
                        <StatusItem key={`${invite}_${index}`} status={"Invited"}/>
                      )
                    ) :
                    <StatusItem status={"Created"}/>
              }
            </td>
          )
        } else {
          const value: string | number | string[] | undefined = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
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
