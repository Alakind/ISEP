import {ApplicantInterface} from "../utils/types.tsx";
import "../styles/progressbar.css";

function Progressbar({ applicant } : Props) {
  return (
    <progress id={`progressbar${applicant.id}`} max="100" value={applicant.score ? applicant.score : 0}>({applicant.score ? applicant.score : 0}%)</progress>
  )
}

interface Props {
  applicant: ApplicantInterface;

}

export default Progressbar
