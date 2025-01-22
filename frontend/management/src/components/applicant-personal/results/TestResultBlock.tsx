import {TestResultsInterface} from "../../../utils/types.tsx";
import "../../../styles/test-result-block.css"

function TestResultBlock({testResults, showTestResults, handleShowTestResults}: Readonly<Props>) {
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
                    <div key={testResult.name + index} className="test-result-block__item">
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
                    </div>
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
}

export default TestResultBlock
