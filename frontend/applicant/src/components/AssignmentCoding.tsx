import {useEffect, useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/snippets/java.js";
import "ace-builds/src-noconflict/ext-language_tools";
import {AssignmentCodingInterface} from "../utils/types.tsx";
import {LanguageToMode, Themes} from "../utils/constants.tsx";
import {runTests, sendCodingSolution} from "../utils/apiFunctions.tsx";
import {useTheme} from "../utils/providers/UseTheme.tsx";
import Button from "./Button.tsx";
import {toast} from "react-toastify";
import CustomWarnToast from "./CustomWarnToast.tsx";

function AssignmentCoding({assignment, fontSize, defaultValue, setAssignmentAnswer,}: Readonly<Props>) {
  const [isCodingOpen, setIsCodingOpen] = useState(true);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [updateIntervalId, setUpdateIntervalId] = useState<NodeJS.Timeout>();

  const [codeValue, setCodeValue] = useState("");
  const [testValue, setTestValue] = useState("");

  const themeData = useTheme();

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
    const intervalId: NodeJS.Timeout = setInterval(async () => {
      await sendCodingSolution(assignment, codeValue, testValue);
    }, 5000);

    setUpdateIntervalId(intervalId);
  };

  const handleBlur = async () => {
    clearInterval(updateIntervalId);
    setUpdateIntervalId(undefined);

    await sendCodingSolution(assignment, codeValue, testValue);
  };

  async function onRunTests() {
    const inviteId = localStorage.getItem("inviteId") ?? "";
    let testResults;
    try {
      testResults = await runTests(
        LanguageToMode[assignment.language.toLowerCase()],
        inviteId,
        codeValue,
        testValue
      );
    } catch (error) {
      if (error instanceof Error) {
        setIsError(true);
        setOutput("Unknown error occurred");
      }
    }

    await sendCodingSolution(assignment, codeValue, testValue);

    if (testResults) {
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
  }


  function handleReset(): void {
    const typeReset = isCodingOpen ? "code" : "tests";
    toast.warn(<CustomWarnToast proceedAction={handleResetProceed} cancelAction={handleResetCancel} message={`Are you sure you want to reset the code in the ${typeReset} tab`}/>)
  }

  function handleResetProceed(): void {
    if (isCodingOpen) {
      setCodeValue(assignment.startCode ?? "");
    } else {
      setTestValue(assignment.startTest ?? "");
    }
  }

  function handleResetCancel(): void {
    toast.info("Code not restored")
  }

  return (
    <div id={assignment.id}>
      <div className={"coding__language"}>{LanguageToMode[assignment.language.toLowerCase()]}</div>
      <div className={"coding__tabs"}>
        <Button
          isDisabled={isCodingOpen}
          btnClasses={`btn--coding__code`}
          handleClick={onOpenCoding}
          spanTextClass={""}
          text={"Code"}
          iconClass={"bi-file-earmark-code"}
        />
        <Button
          isDisabled={!isCodingOpen}
          btnClasses={`btn--coding__tests`}
          handleClick={onOpenTest}
          spanTextClass={""}
          text={"Tests"}
          iconClass={"bi-clipboard2-check"}
        />
        <Button
          btnClasses={`btn--reset`}
          handleClick={handleReset}
          spanTextClass={""}
          text={"Reset"}
          iconClass={"bi-arrow-counterclockwise"}
        />
      </div>
      <AceEditor
        mode={LanguageToMode[assignment.language.toLowerCase()]}
        theme={themeData.theme === Themes.DARK ? "twilight" : "eclipse"}
        name={assignment.id.toString()}
        fontSize={fontSize ?? 16}
        defaultValue={defaultValue ?? ""}
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
      <Button
        isDisabled={!isCodingOpen}
        btnClasses={`btn-lg btn--coding btn--coding__run-test`}
        handleClick={onRunTests}
        spanTextClass={""}
        text={"Run Tests"}
        iconClass={"bi-play"}
      />
      <div>
        {output !== "" ? (
          <>
            <h5 className={"coding__header-test-results"}>Test results</h5>
            <AceEditor
              theme={themeData.theme === Themes.DARK ? "twilight" : "eclipse"}
              name={assignment.id.toString() + " output"}
              fontSize={fontSize ?? 16}
              defaultValue={""}
              editorProps={{$blockScrolling: true}}
              value={output}
              height="200px"
              width="inherit"
              readOnly={true}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

interface Props {
  assignment: AssignmentCodingInterface;
  fontSize?: number;
  defaultValue?: string;
  setAssignmentAnswer: (arg: object) => void;
}

export default AssignmentCoding;
