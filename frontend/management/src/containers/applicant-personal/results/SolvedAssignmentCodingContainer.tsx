import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import {useState} from "react";
import SolvedAssignmentCoding from "../../../components/applicant-personal/results/SolvedAssignmentCoding.tsx";

function SolvedAssignmentCodingContainer({theme = Themes.LIGHT, assignment}: Readonly<Props>) {
  const [showCodeChanges, setShowCodeChanges] = useState<boolean>(false);
  const [showTestResults, setShowTestResults] = useState<boolean>(false);
  const [showTestCode, setShowTestCode] = useState<boolean>(false);
  const [showReferenceTestCode, setShowReferenceTestCode] = useState<boolean>(false);
  const [showReferenceCode, setShowReferenceCode] = useState<boolean>(false);

  function handleShowCodeChanges(): void {
    setShowCodeChanges((prevState: boolean) => !prevState);
  }

  function handleShowTestResults(): void {
    setShowTestResults((prevState: boolean) => !prevState);
  }

  function handleShowTestCode(): void {
    setShowTestCode((prevState: boolean) => !prevState);
  }

  function handleShowReferenceTestCode(): void {
    setShowReferenceTestCode((prevState: boolean) => !prevState);
  }

  function handleShowReferenceCode(): void {
    setShowReferenceCode((prevState: boolean) => !prevState);
  }

  return (
    <SolvedAssignmentCoding
      assignment={assignment}
      handleShowCodeChanges={handleShowCodeChanges}
      showCodeChanges={showCodeChanges}
      showTestResults={showTestResults}
      handleShowTestResults={handleShowTestResults}
      theme={theme}
      handleShowTestCode={handleShowTestCode}
      showTestCode={showTestCode}
      showReferenceCode={showReferenceCode}
      handleShowReferenceCode={handleShowReferenceCode}
      showReferenceTestCode={showReferenceTestCode}
      handleShowReferenceTestCode={handleShowReferenceTestCode}
    />
  )
}

interface Props {
  theme?: (typeof Themes)[keyof typeof Themes];
  assignment: AssignmentCodingSolvedInterface;
}

export default SolvedAssignmentCodingContainer
