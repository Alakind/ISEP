import ReactDiffViewer, {DiffMethod} from "react-diff-viewer-continued";
import {Themes} from "../../../utils/constants.tsx";
import {TestResultsInterface} from "../../../utils/types.tsx";
import {useState} from "react";

function TestResultRow({testResult, theme}: Readonly<Props>) {
  const [showTestCode, setShowTestCode] = useState<boolean>(false);

  function handleShowTestCode() {
    setShowTestCode((prev) => !prev);
  }

  return (
    <div>
      <div className="test-result-block__item">
        <span>
        {
          testResult.passed
            ? <i className="bi bi-check-circle-fill"></i>
            : <i className="bi bi-x-circle-fill"></i>
        }
        </span>
        <span>{testResult.name}</span>
        {
          testResult.message
            ? <span>: {testResult.message}</span>
            : <></>
        }
        <span>
          <button className={"btn btn--transparent"} onClick={handleShowTestCode}>
            <i className={`bi ${showTestCode ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </span>
      </div>
      <div className={`${showTestCode ? "test-result-block__code" : ""}`}>
        <span>
        {
          showTestCode
            ? (
              <ReactDiffViewer
                extraLinesSurroundingDiff={2}
                newValue={(testResult.code) ?? "sdfsdf"}
                compareMethod={DiffMethod.CHARS}
                splitView={false}
                useDarkTheme={theme === Themes.DARK}
              />
            ) : null
        }
        </span>
      </div>
    </div>
  )
}

interface Props {
  testResult: TestResultsInterface;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default TestResultRow
