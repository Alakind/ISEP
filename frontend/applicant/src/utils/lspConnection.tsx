import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createProtocolConnection,
  ProtocolConnection,
} from "vscode-languageserver-protocol/browser";

let connection: ProtocolConnection;
let currentDocument: string;

export function initLanguageServerConnection(
  endpoint: string = "wss://localhost:2087/",
  document: string = ""
): ProtocolConnection {
  currentDocument = document;

  // Connect to LSP server
  const socket = new WebSocket(endpoint); // Replace with your LSP server's WebSocket URL
  const reader = new BrowserMessageReader(socket);
  const writer = new BrowserMessageWriter(socket);
  connection = createProtocolConnection(reader, writer);

  console.log("Init LSP");
  // Initialize the LSP server
  connection.sendNotification("initialize", {
    rootUri: "file://file.txt",
    capabilities: {}, // Add capabilities specific to your use case
  });

  return connection;
}

export function getLspCompletionSource() {
  return async (context: any) => {
    const { state, pos } = context;

    // Map CodeMirror position to LSP position
    const completionParams = {
      //   textDocument: { uri: `file:///${currentDocument}.txt` }, // TODO: check whether this works
      textDocument: { uri: `file://file.txt` }, // TODO: check whether this works
      position: {
        line: state.doc.lineAt(pos).number - 1,
        character: pos - state.doc.lineAt(pos).from,
      },
    };

    // Send a completion request to the LSP server
    try {
      const response = await connection.sendRequest(
        "textDocument/completion",
        completionParams
      );
      if (response && response.items) {
        return {
          from: context.pos,
          options: response.items.map((item) => ({
            label: item.label,
            type: item.kind,
            detail: item.detail || "",
            info: item.documentation?.value || "",
          })),
        };
      }
    } catch (error) {
      console.error("Error fetching completions from LSP:", error);
    }

    return null;
  };
}
