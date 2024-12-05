import "../styles/status-item.css";
import {ApplicantStatuses} from "../utils/constants.tsx";

function StatusItem({status} : Props) {
  return (
    <span className={`status-item ${status == ApplicantStatuses.ASSESSMENT_EXPIRED ? "status-item--error" : "status-item--info"} `}>{status}</span>
  )
}

interface Props {
  status: ApplicantStatuses //TODO make an element with {status: cancelled, time: 05/12/24 10:00}
}
export default StatusItem
