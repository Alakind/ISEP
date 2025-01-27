import {ReactNode, useEffect, useMemo, useState} from "react";
import {loginRequest} from "../../AuthConfig.ts";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";
import {jwtDecode} from "jwt-decode";
import {ExJwtPayload} from "../types.tsx";
import {MsUserContext} from "./MsUserContext.tsx";

interface MsUserInterface {
  givenName: string;
  surname: string;
  mail: string;
  oid: string;
}

export const MsUserProvider = ({children, activeAccount, instance}: { children: ReactNode, activeAccount: AccountInfo, instance: IPublicClientApplication }) => {
  const [msUserData, setMsUserData] = useState<MsUserInterface>({
    givenName: "",
    surname: "",
    mail: "",
    oid: ""
  });

  useEffect(() => {
    if ((msUserData.mail === "" && msUserData.surname === "") && activeAccount) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
          redirectUri: "/redirect.html"
        })
        .then((response) => {
          const data: ExJwtPayload = jwtDecode(response.accessToken);
          let newGivenName = data.given_name;
          if (!newGivenName && data.unique_name) {
            newGivenName = data.unique_name.replace(/@.*/i, "");
          } else if (!newGivenName) {
            console.error("No replacement for givenName");
            newGivenName = "";
          }
          setMsUserData({
            givenName: newGivenName,
            surname: data.family_name ?? "",
            mail: data.unique_name ?? "",
            oid: data.oid
          });
        })
        .catch((error) => {
          console.error("Error acquiring token", error);
          instance.logoutRedirect({postLogoutRedirectUri: "/",}).then()
        });
    }
  }, [activeAccount]);

  const contextValue = useMemo(() => ({givenName: msUserData.givenName, surname: msUserData.surname, mail: msUserData.mail, oid: msUserData.oid}), [msUserData]);

  return <MsUserContext.Provider value={contextValue}>{children}</MsUserContext.Provider>;
}


