import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";

function ReferenceCodeBlock({assignment, showReferenceCode, handleShowReferenceCode, theme}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      <button className="solved-assignment-coding__header" onClick={handleShowReferenceCode}>
        Reference code{" "}
        <span>
          <i className={`bi ${showReferenceCode ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        showReferenceCode
          ? (
            <>
              {
                assignment.referenceAnswer.code
                  ? (
                    <div className={"coding__diff-viewer"}>
                      <ReactDiffViewer
                        showDiffOnly={false}
                        oldValue={assignment.referenceAnswer.code ?? ""}
                        newValue={assignment.referenceAnswer.code ?? ""}
                        compareMethod={DiffMethod.CHARS}
                        splitView={false}
                        useDarkTheme={theme === Themes.DARK}
                      />
                    </div>
                  ) : (
                    <>No reference code answer found.</>
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
  showReferenceCode: boolean;
  handleShowReferenceCode: () => void;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default ReferenceCodeBlock
