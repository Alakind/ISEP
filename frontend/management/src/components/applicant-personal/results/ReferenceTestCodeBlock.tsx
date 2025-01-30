import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";

function ReferenceTestCodeBlock({assignment, showReferenceTestCode, handleShowReferenceTestCode, theme}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      <button className="solved-assignment-coding__header" onClick={handleShowReferenceTestCode}>
        Reference test code{" "}
        <span>
          <i className={`bi ${showReferenceTestCode ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        showReferenceTestCode
          ? (
            <>
              {
                assignment.referenceAnswer.test
                  ? (
                    <div className={"coding__diff-viewer"}>
                      <ReactDiffViewer
                        extraLinesSurroundingDiff={2}
                        oldValue={assignment.referenceAnswer.test ?? ""}
                        newValue={assignment.referenceAnswer.test ?? ""}
                        compareMethod={DiffMethod.CHARS}
                        splitView={false}
                        useDarkTheme={theme === Themes.DARK}
                      />
                    </div>
                  ) : (
                    <>No reference test code answer found.</>
                  )
              }
            </>
          ) : (
            <></>
          )
      }
    </div>
  )
}

interface Props {
  assignment: AssignmentCodingSolvedInterface
  showReferenceTestCode: boolean;
  handleShowReferenceTestCode: () => void;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default ReferenceTestCodeBlock
