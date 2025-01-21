import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {router} from "./routerConfiguration.tsx";
import {ThemeProvider} from "./ThemeContext.tsx";
import {MsalProvider} from "@azure/msal-react";
import {AuthenticationResult, EventType, PublicClientApplication} from "@azure/msal-browser";
import {msalConfig} from "./AuthConfig.ts";

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
}

msalInstance.addEventCallback((event) => {
  if (event.payload) {
    const authenticationResult = event.payload as AuthenticationResult;
    const account = authenticationResult.account;
    if (event.eventType === EventType.LOGIN_SUCCESS && account) {
      msalInstance.setActiveAccount(account)
    }
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </MsalProvider>
  </StrictMode>
);
