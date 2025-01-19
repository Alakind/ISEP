// import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { pythonLanguage } from "@codemirror/lang-python";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";
import {
  getLspCompletionSource,
  initLanguageServerConnection,
} from "../utils/lspConnection";

function CodeEditorContainer() {
  const [value, setValue] = useState("print('hello world!')");
  const onChange = useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

  useEffect(() => {
    initLanguageServerConnection();
  }, []);

  return (
    <div style={{ color: "black", textAlign: "left" }}>
      <ReactCodeMirror
        value={value}
        height="400px"
        width="600px"
        // extensions={[javascript({ jsx: true })]}
        extensions={[
          pythonLanguage,
          autocompletion({ override: [getLspCompletionSource()] }),
        ]}
        onChange={onChange}
        theme="dark"
        basicSetup={{
          autocompletion: true,
        }}
      />
    </div>
  );

  //   return <div>Code Editor</div>;
}

export default CodeEditorContainer;
