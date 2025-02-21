import {TestResultsInterface} from "../../../utils/types.tsx";
import "../../../styles/test-result-block.css"
import TestResultRow from "./TestResultRow.tsx";

function TestResultBlock({testResults, showTestResults, handleShowTestResults}: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      <button className="solved-assignment-coding__header" onClick={handleShowTestResults}>
        Test results{" "}
        <span>
          <i className={`bi ${showTestResults ? "bi-arrows-collapse" : "bi-arrows-expand"}`}></i>
        </span>
      </button>
      {
        testResults && testResults.length > 0
          ? (
            <>
              {
                showTestResults
                  ? (
                    <>
                      {
                        testResults.map((testResult, index) => {
                          return (
                            <TestResultRow key={testResult.name + index} testResult={testResult}/>
                          )
                        })
                      }
                    </>
                  ) : (
                    <></>
                  )
              }
            </>
          ) : (
            <>
              {
                showTestResults
                  ? (
                    <p className="test-result-block">No test results available</p>
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
  testResults: TestResultsInterface[];
  showTestResults: boolean;
  handleShowTestResults: () => void;
}

export default TestResultBlock
