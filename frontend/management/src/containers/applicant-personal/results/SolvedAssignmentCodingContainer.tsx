import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import {useState} from "react";
import SolvedAssignmentCoding from "../../../components/applicant-personal/results/SolvedAssignmentCoding.tsx";

function SolvedAssignmentCodingContainer({theme = Themes.LIGHT, assignment}: Readonly<Props>) {
  const [showCodeChanges, setShowCodeChanges] = useState<boolean>(false);
  const [showTestResults, setShowTestResults] = useState<boolean>(true);

  function handleShowCodeChanges(): void {
    setShowCodeChanges((prevState: boolean) => !prevState);
  }

  function handleShowTestResults(): void {
    setShowTestResults((prevState: boolean) => !prevState);
  }

  return (
    <SolvedAssignmentCoding
      assignment={assignment}
      handleShowCodeChanges={handleShowCodeChanges}
      showCodeChanges={showCodeChanges}
      showTestResults={showTestResults}
      handleShowTestResults={handleShowTestResults}
      theme={theme}
    />
  )
}

interface Props {
  theme?: (typeof Themes)[keyof typeof Themes];
  assignment: AssignmentCodingSolvedInterface;
}

export default SolvedAssignmentCodingContainer
