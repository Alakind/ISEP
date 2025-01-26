import {TestResultsInterface} from "../../../utils/types.tsx";
import "../../../styles/test-result-block.css"
import TestResultRow from "./TestResultRow.tsx";
import {Themes} from "../../../utils/constants.tsx";

function TestResultBlock({testResults, showTestResults, handleShowTestResults, theme}: Readonly<Props>) {
  return (
    <div className="test-result-block">
      <button className="test-result-block__header" onClick={handleShowTestResults}>
        Test results{" "}
        <span>
          <i className={`bi ${showTestResults ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        showTestResults
          ? (
            <>
              {
                testResults.map((testResult, index) => {
                  return (
                    <TestResultRow key={testResult.name + index} testResult={testResult} theme={theme}/>
                  )
                })
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
  testResults: TestResultsInterface[];
  showTestResults: boolean;
  handleShowTestResults: () => void;
  theme?: (typeof Themes)[keyof typeof Themes];
}

export default TestResultBlock
