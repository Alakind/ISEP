import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import "../../../styles/coding-diff.css"
import TestResultBlock from "./TestResultBlock.tsx";

function SolvedAssignmentCoding({theme = Themes.LIGHT, assignment, handleShowCodeChanges, showCodeChanges, showTestResults, handleShowTestResults}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      {
        (!assignment.startCode && !assignment.answer?.answer) || assignment.answer?.answer == assignment.startCode
          ? (
            <p>No changes are made to the original code</p>
          ) : (
            <>
              <button className="solved-assignment-coding__header" onClick={handleShowCodeChanges}>
                Code changes{" "}
                <span>
                  <i className={`bi ${showCodeChanges ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
                </span>
              </button>
              {
                showCodeChanges && (
                  <div className={"coding__diff-viewer"}>
                    <ReactDiffViewer
                      extraLinesSurroundingDiff={2}
                      oldValue={(assignment.startCode) ?? ""}
                      compareMethod={DiffMethod.CHARS}
                      splitView={false}
                      newValue={(assignment.answer.answer || assignment.answer) ?? ""}
                      useDarkTheme={theme === Themes.DARK}
                    />

                  </div>
                )
              }
              {
                assignment.testResults && assignment.testResults.length > 0
                  ? (
                    <TestResultBlock
                      testResults={assignment.testResults}
                      showTestResults={showTestResults}
                      handleShowTestResults={handleShowTestResults}
                      theme={theme}
                    />
                  ) : (
                    <p>No test results available</p>
                  )
              }
            </>
          )
      }
    </div>
  )
}

interface Props {
  theme?: (typeof Themes)[keyof typeof Themes];
  assignment: AssignmentCodingSolvedInterface;
  handleShowCodeChanges: () => void;
  showCodeChanges: boolean;
  showTestResults: boolean;
  handleShowTestResults: () => void;
}

export default SolvedAssignmentCoding
