import "../styles/status-item.css";
import {ApplicantStatuses} from "../utils/constants.tsx";

function StatusItem({status} : Props) {
  return (
    <span className={`status-item ${status.toString() == ApplicantStatuses.ASSESSMENT_EXPIRED ? "status-item--error" : "status-item--info"} `}>{status.toString()}</span>
  )
}

interface Props {
  status: typeof ApplicantStatuses //TODO make an element with {status: cancelled, time: 05/12/24 10:00}
}
export default StatusItem
