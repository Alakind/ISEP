import "../styles/status-item.css";
import {InviteStatuses} from "../utils/constants.tsx";
import {ReactNode} from "react";

function StatusItem({status, additionalClass}: Readonly<Props>): ReactNode {
  return (
    <span data-testid={"status-item"} className={`status-item ${status == InviteStatuses.EXPIRED ? "status-item--error" : "status-item--info"} ${additionalClass ?? ""}`}>{status}</span>
  )
}

interface Props {
  status: string;
  additionalClass?: string;
}

export default StatusItem
