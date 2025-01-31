import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";

function TestCodeBlock({assignment, showTestCode, handleShowTestCode, theme}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      <button className="solved-assignment-coding__header" onClick={handleShowTestCode}>
        Test code changes{" "}
        <span>
          <i className={`bi ${showTestCode ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        showTestCode
          ? (
            <div className={"coding__diff-viewer"}>
              <ReactDiffViewer
                extraLinesSurroundingDiff={2}
                oldValue={assignment.startTest ?? ""}
                compareMethod={DiffMethod.CHARS}
                splitView={false}
                newValue={assignment.answer.test ?? ""}
                useDarkTheme={theme === Themes.DARK}
              />
            </div>
          ) : (
            <></>
          )
      }
    </div>
  )
}

interface Props {
  assignment: AssignmentCodingSolvedInterface
  showTestCode: boolean;
  handleShowTestCode: () => void;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default TestCodeBlock
