import {useEffect, useState} from "react";
import AceEditor from "react-ace";
// import "ace-builds/webpack-resolver.js";
// import brace from 'brace';
// import 'brace/mode/java';
// import 'brace/mode/javascript';
// import 'brace/theme/
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/snippets/java.js";
import "ace-builds/src-noconflict/ext-language_tools";
import {AssignmentCodingInterface} from "../utils/types.tsx";
import {LanguageToMode} from "../utils/constants.tsx";
import {runTests, sendCodingSolution} from "../utils/apiFunctions.tsx";

function AssignmentCoding({
                            assignment,
                            theme,
                            fontSize,
                            defaultValue,
                            setAssignmentAnswer,
                          }: Readonly<Props>) {
  const [isCodingOpen, setIsCodingOpen] = useState(true);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [updateIntervalId, setUpdateIntervalId] = useState(0);

  const [codeValue, setCodeValue] = useState("");
  const [testValue, setTestValue] = useState("");

  useEffect(() => {
    setCodeValue(assignment.answer.code ?? assignment.startCode ?? "Code stub");

    setTestValue(assignment.answer.test ?? assignment.startTest ?? "Test stub");
  }, []);

  function onChangeValue(newValue: string) {
    if (isError) {
      setIsError(false);
      setOutput("");
    }

    if (isCodingOpen) {
      setCodeValue(newValue);
      setAssignmentAnswer({code: newValue});
    } else {
      setTestValue(newValue);
      setAssignmentAnswer({test: newValue});
    }
  }

  function onOpenCoding() {
    setIsCodingOpen(true);
  }

  function onOpenTest() {
    setIsCodingOpen(false);
  }

  const handleOnFocus = () => {
    const intervalId = setInterval(async () => {
      await sendCodingSolution(assignment, codeValue, testValue);
    }, 5000);

    setUpdateIntervalId(intervalId);
  };

  const handleBlur = async () => {
    clearInterval(updateIntervalId);
    setUpdateIntervalId(0);

    await sendCodingSolution(assignment, codeValue, testValue);
  };

  async function onRunTests() {
    const inviteId = localStorage.getItem("inviteId") ?? "";

    try {
      const testResults = await runTests(
        LanguageToMode[assignment.language.toLowerCase()],
        inviteId,
        codeValue,
        testValue
      );
    } catch (error) {
      setIsError(true);
      setOutput("Error");
    }

    await sendCodingSolution(assignment, codeValue, testValue);

    const resultsString = testResults
      .map((result) => {
        return (
          result.name +
          ": " +
          (result.passed ? "passed" : "failed") +
          "\n" +
          result.result +
          "\n"
        );
      })
      .join("\n");

    setOutput(resultsString);
  }

  return (
    <div id={assignment.id}>
      <div>Language: {LanguageToMode[assignment.language.toLowerCase()]}</div>
      <div>
        <button
          className={
            "btn btn-primary btn-lg " + (isCodingOpen ? "disabled" : "")
          }
          onClick={onOpenCoding}
        >
          Code
        </button>
        <button
          className={
            "btn btn-primary btn-lg " + (isCodingOpen ? "" : "disabled")
          }
          onClick={onOpenTest}
        >
          Tests
        </button>
      </div>

      <AceEditor
        mode={LanguageToMode[assignment.language.toLowerCase()]}
        theme={theme == undefined ? "twilight" : theme}
        name={assignment.id.toString()}
        fontSize={fontSize == undefined ? 16 : fontSize}
        defaultValue={defaultValue == undefined ? "" : defaultValue}
        editorProps={{$blockScrolling: true}}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
        value={isCodingOpen ? codeValue : testValue}
        onChange={onChangeValue}
        width="inherit"
        onFocus={handleOnFocus}
        onBlur={handleBlur}
      />

      <div>
        <button
          className="btn btn-primary btn-lg btn--mod"
          onClick={onRunTests}
        >
          Run Tests
        </button>
      </div>

      <div>
        {output !== "" ? (
          <AceEditor
            theme={theme == undefined ? "twilight" : theme}
            name={assignment.id.toString() + " output"}
            fontSize={fontSize == undefined ? 16 : fontSize}
            defaultValue={""}
            editorProps={{$blockScrolling: true}}
            value={output}
            height="200px"
            width="inherit"
            readOnly={true}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

interface Props {
  assignment: AssignmentCodingInterface;
  theme?: string;
  fontSize?: number;
  defaultValue?: string;
  setAssignmentAnswer: (arg: object) => void;
}

export default AssignmentCoding;
