import "../styles/status-item.css";
import {InviteStatuses} from "../utils/constants.tsx";
import {ReactNode} from "react";

function StatusItem({status, additionalClass}: Props): ReactNode {
  return (
    <span className={`status-item ${status == InviteStatuses.EXPIRED ? "status-item--error" : "status-item--info"} ${additionalClass ?? ""}`}>{status}</span>
  )
}

interface Props {
  status: string //TODO make an element with {status: cancelled, time: 05/12/24 10:00}
  additionalClass?: string
}

export default StatusItem
