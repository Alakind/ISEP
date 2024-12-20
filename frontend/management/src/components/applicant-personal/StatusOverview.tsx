import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {ApplicantInterface} from "../../utils/types.tsx";
import "../../styles/status-overview.css";

function StatusOverview({applicant}: Props) {
  return (
    <span className="status-overview">
      <h4>Status</h4>
      <StatusItem status={mapStatus(applicant.status)}/>
    </span>
  )
}

interface Props {
  applicant: ApplicantInterface;
}

export default StatusOverview
