import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import {MouseEvent, useState} from "react";
import SolvedAssignmentCoding from "../../../components/applicant-personal/results/SolvedAssignmentCoding.tsx";

function SolvedAssignmentCodingContainer({theme = Themes.LIGHT, assignment}: Readonly<Props>) {
  const [highlightLine, setHighlightLine] = useState<string[]>([]);
  const [showCodeChanges, setShowCodeChanges] = useState<boolean>(false);
  const [showTestResults, setShowTestResults] = useState<boolean>(true);

  function onLineNumberClick(id: string, e: MouseEvent<HTMLTableCellElement>) {
    let lines = [id];
    console.log(id)
    if (e.shiftKey && highlightLine.length === 1) {
      const [dir, oldId] = highlightLine[0].split('-');
      const [newDir, newId] = id.split('-');
      if (dir === newDir) {
        lines = [];
        const lowEnd = Math.min(Number(oldId), Number(newId));
        const highEnd = Math.max(Number(oldId), Number(newId));
        for (let i = lowEnd; i <= highEnd; i++) {
          lines.push(`${dir}-${i}`);
        }
      }
    }
    setHighlightLine(lines);
  }

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
      highlightLine={highlightLine}
      onLineNumberClick={onLineNumberClick}
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
