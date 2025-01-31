import "../styles/progressbar.css";
import {ReactNode} from "react";

function Progressbar({id, score, max}: Readonly<Props>): ReactNode {
  return (
    <progress
      id={`progressbar${id}`}
      max={max ?? 100}
      value={score ?? 0}
      data-testid={"progressbar"}
    >
      ({score ?? 0}%)
    </progress>
  )
}

interface Props {
  id: string;
  score?: number;
  max?: number;
}

export default Progressbar
