import {ApplicantInterface} from "../utils/types.tsx";
import "../styles/progressbar.css";
import {ReactNode} from "react";

function Progressbar({applicant}: Readonly<Props>): ReactNode {
  return (
    <progress
      id={`progressbar${applicant.id}`}
      max="100"
      value={applicant.score ? applicant.score : 0}
      data-testid={"progressbar"}
    >
      ({applicant.score ? applicant.score : 0}%)
    </progress>
  )
}

interface Props {
  applicant: ApplicantInterface;

}

export default Progressbar
