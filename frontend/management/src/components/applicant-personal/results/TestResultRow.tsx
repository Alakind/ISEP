import {TestResultsInterface} from "../../../utils/types.tsx";

function TestResultRow({testResult}: Readonly<Props>) {

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
      </div>
    </div>
  )
}

interface Props {
  testResult: TestResultsInterface;
}

export default TestResultRow
