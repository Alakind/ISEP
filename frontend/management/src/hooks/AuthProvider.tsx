// import {AuthenticationResult, EventType, PublicClientApplication} from "@azure/msal-browser";
// import {MsalProvider} from "@azure/msal-react";
// import {ReactNode} from "react";
// import {msalConfig} from "../AuthConfig.ts";
//
// export const AuthProvider = ({children}: Readonly<Props>) => {
//   const msalInstance = new PublicClientApplication(msalConfig)
//
//   if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
//     msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
//   }
//
//   msalInstance.addEventCallback((event) => {
//     const authenticationResult = event.payload as AuthenticationResult;
//     const account = authenticationResult.account;
//     if (event.eventType === EventType.LOGIN_SUCCESS && account) {
//       msalInstance.setActiveAccount(account)
//     }
//   })
//
//   return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
// }
//
// interface Props {
//   children: ReactNode;
// }
//
// export function useAuthProvider() {
//   return {AuthProvider};
// }