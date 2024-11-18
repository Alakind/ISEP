import React from 'react';
import ace from 'ace-builds';
import AceEditor from "react-ace";
// import "ace-builds/webpack-resolver.js";
// import brace from 'brace';

// import 'brace/mode/java';
// import 'brace/mode/javascript';

// import 'brace/theme/
import "ace-builds/src-noconflict/ace"
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/snippets/java.js"
import "ace-builds/src-noconflict/ext-language_tools";
import {AssignmentCodingInterface} from "../utils/types.tsx";

function AssignmentCoding({assignment, theme, fontSize, defaultValue} : Props) {
    return (
        <div id={assignment.id}>
            <AceEditor
                mode="java"
                theme={theme == undefined ? "twilight" : theme}
                name={assignment.id}
                fontSize={fontSize == undefined ? 14 : fontSize}
                width="100%"
                defaultValue={defaultValue == undefined ? "" : defaultValue}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                }}
            />
        </div>
    )
}

interface Props {
    assignment: AssignmentCodingInterface;
    theme?: string;
    fontSize?: number;
    defaultValue?: string;
}
export default AssignmentCoding;
