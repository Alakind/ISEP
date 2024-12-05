import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useCallback, useState } from "react";

function CodeEditorContainer() {
  const [value, setValue] = useState("console.log('hello world!');");
  const onChange = useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  return (
    <div style={{ color: "black", textAlign: "left" }}>
      <ReactCodeMirror
        value={value}
        height="400px"
        width="600px"
        extensions={[javascript({ jsx: true })]}
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
