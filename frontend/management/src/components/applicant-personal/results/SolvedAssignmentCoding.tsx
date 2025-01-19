import {MouseEvent} from 'react';
import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import "../../../styles/coding-diff.css"
import TestResultBlock from "./TestResultBlock.tsx";

function SolvedAssignmentCoding({theme = Themes.LIGHT, assignment, handleShowCodeChanges, showCodeChanges, highlightLine, onLineNumberClick, showTestResults, handleShowTestResults}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      {
        assignment.referenceAnswer == undefined || assignment.answer == undefined || assignment.referenceAnswer.answer == "" || assignment.answer.answer == "" || assignment.answer.answer == assignment.referenceAnswer.answer
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
                      highlightLines={highlightLine}
                      onLineNumberClick={onLineNumberClick}
                      extraLinesSurroundingDiff={2}
                      oldValue={(assignment.answer.answer || assignment.answer) ?? ""}
                      compareMethod={DiffMethod.CHARS}
                      splitView={false}
                      newValue={(assignment.referenceAnswer.answer || assignment.referenceAnswer) ?? ""}
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
  highlightLine: string[];
  onLineNumberClick: (id: string, e: MouseEvent<HTMLTableCellElement>) => void;
  showTestResults: boolean;
  handleShowTestResults: () => void;
}

export default SolvedAssignmentCoding
