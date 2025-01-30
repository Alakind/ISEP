import {Themes} from "../../../utils/constants.tsx";
import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";
import "../../../styles/coding-diff.css"
import TestResultBlock from "./TestResultBlock.tsx";
import CodeBlock from "./CodeBlock.tsx";
import TestCodeBlock from "./TestCodeBlock.tsx";
import ReferenceTestCodeBlock from "./ReferenceTestCodeBlock.tsx";
import ReferenceCodeBlock from "./ReferenceCodeBlock.tsx";

function SolvedAssignmentCoding({
                                  theme = Themes.LIGHT,
                                  assignment,
                                  handleShowCodeChanges,
                                  showCodeChanges,
                                  showTestResults,
                                  handleShowTestResults,
                                  showTestCode,
                                  handleShowTestCode,
                                  showReferenceCode,
                                  handleShowReferenceCode,
                                  showReferenceTestCode,
                                  handleShowReferenceTestCode
                                }: Readonly<Props>) {
  return (
    <div className="solved-assignment-coding">
      {
        <>
          <h6><b><u>Code</u></b></h6>
          <CodeBlock
            assignment={assignment}
            showCodeChanges={showCodeChanges}
            handleShowCodeChanges={handleShowCodeChanges}
            theme={theme}
          />
          <ReferenceCodeBlock
            assignment={assignment}
            showReferenceCode={showReferenceCode}
            handleShowReferenceCode={handleShowReferenceCode}
            theme={theme}
          />
          <h6 className={"solved-assignment-coding__sub"}><b><u>Test</u></b></h6>
          <TestCodeBlock
            assignment={assignment}
            showTestCode={showTestCode}
            handleShowTestCode={handleShowTestCode}
            theme={theme}
          />
          <ReferenceTestCodeBlock
            assignment={assignment}
            showReferenceTestCode={showReferenceTestCode}
            handleShowReferenceTestCode={handleShowReferenceTestCode}
            theme={theme}
          />
          <TestResultBlock
            testResults={assignment.testResults}
            showTestResults={showTestResults}
            handleShowTestResults={handleShowTestResults}
            theme={theme}
          />
        </>
      }
    </div>
  )
}

interface Props {
  theme?: (typeof Themes)[keyof typeof Themes];
  assignment: AssignmentCodingSolvedInterface;
  handleShowCodeChanges: () => void;
  showCodeChanges: boolean;
  showTestResults: boolean;
  handleShowTestResults: () => void;
  showTestCode: boolean;
  handleShowTestCode: () => void;
  showReferenceCode: boolean;
  handleShowReferenceCode: () => void;
  showReferenceTestCode: boolean;
  handleShowReferenceTestCode: () => void;
}

export default SolvedAssignmentCoding
