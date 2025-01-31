import {ApplicantInterface, Column, InviteInterface} from "../../utils/types.tsx";
import Progressbar from "../Progressbar.tsx";
import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {ReactNode} from "react";

function TableRowInvites({inviteData, columns, goToApplicantPage, applicantData, today = new Date()}: Readonly<Props>): ReactNode {
  return (
    <tr data-testid={"table-row-invites"}>
      {columns.map(({accessor, label}: Column): ReactNode => {
        if (accessor == "name") {
          return (
            <th className="table-row__link" key={accessor} scope="row" onClick={(): void => goToApplicantPage(applicantData.id)}>
              <a>{applicantData.name}</a>
            </th>
          );
        } else if (accessor == "score") {
          return (
            <td key={accessor}>
              <span className="table-row__score">
              {inviteData.scoredPoints ?? 0}/{inviteData.availablePoints ?? 0}
              </span>
              <Progressbar id={applicantData.id} score={inviteData.scoredPoints} max={inviteData.availablePoints ?? 0}/>
            </td>
          );
        } else if (accessor == "status") {
          return (
            <td key={accessor} className={"block__status-item"}>
              <StatusItem status={mapStatus(inviteData.status)}/>
            </td>
          )
        } else if (accessor === "email") {
          return (
            <td key={accessor}>
              {applicantData.email}
            </td>
          )
        } else if (accessor === "date") {
          return (
            <td key={accessor}>
              {inviteData.assessmentFinishedAt ? new Date(inviteData.assessmentFinishedAt).toUTCString() : ""}
            </td>
          )
        } else if (accessor === "days") {
          if (inviteData.expiresAt != "") {
            const expirationDate: number = new Date(inviteData.expiresAt).valueOf();
            const diffInMilliseconds: number = today.valueOf() - expirationDate;
            const diffInDays: number = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
            return (
              <td key={accessor}>
                {label !== "Expired Days" ? -1 * diffInDays : diffInDays}
              </td>
            );
          } else {
            return (
              <td key={accessor}>
                ——
              </td>
            )
          }
        }
      })}
    </tr>
  )
}

interface Props {
  inviteData: InviteInterface;
  applicantData: ApplicantInterface;
  columns: Column[];
  goToApplicantPage: (id: string) => void;
  today?: Date;
}

export default TableRowInvites
