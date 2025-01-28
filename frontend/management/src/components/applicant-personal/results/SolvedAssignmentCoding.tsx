import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import "../../../styles/coding-diff.css"
import TestResultBlock from "./TestResultBlock.tsx";

function SolvedAssignmentCoding({theme = Themes.LIGHT, assignment, handleShowCodeChanges, showCodeChanges, showTestResults, handleShowTestResults, showTestCode, handleShowTestCode}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      {
        (!assignment.startCode && !assignment.answer?.code) || assignment.answer?.code == assignment.startCode || !assignment.answer?.code
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
                      newValue={(assignment.answer?.code) ?? ""}
                      useDarkTheme={theme === Themes.DARK}
                    />
                  </div>
                )
              }
              <TestResultBlock
                testResults={assignment.testResults}
                showTestResults={showTestResults}
                handleShowTestResults={handleShowTestResults}
                theme={theme}
              />
              <button className="test-result-block__header" onClick={handleShowTestCode}>
                Test code diff{" "}
                <span>
                  <i className={`bi ${showTestCode ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
                </span>
              </button>
              {
                showTestCode
                    ? (
                        <ReactDiffViewer
                            extraLinesSurroundingDiff={2}
                            oldValue={assignment.startTest ?? ""}
                            compareMethod={DiffMethod.CHARS}
                            splitView={false}
                            newValue={assignment.answer.test ?? ""}
                            useDarkTheme={theme === Themes.DARK}
                        />
                    ) : (
                        <></>
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
  showTestCode: boolean;
  handleShowTestCode: () => void;
}

export default SolvedAssignmentCoding
