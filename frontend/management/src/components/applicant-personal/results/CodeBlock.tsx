import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";

function CodeBlock({assignment, showCodeChanges, handleShowCodeChanges, theme}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      <button className="solved-assignment-coding__header" onClick={handleShowCodeChanges}>
        Code changes{" "}
        <span>
          <i className={`bi ${showCodeChanges ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        showCodeChanges
          ? (
            <>
              {
                (!assignment.startCode && !assignment.answer?.code) || assignment.answer?.code == assignment.startCode || !assignment.answer?.code
                  ? (
                    <p>No changes are made to the original code</p>
                  ) : (
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
            </>
          ) : (
            <>
            </>
          )
      }
    </div>
  )
}

interface Props {
  assignment: AssignmentCodingSolvedInterface;
  showCodeChanges: boolean;
  handleShowCodeChanges: () => void;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default CodeBlock
