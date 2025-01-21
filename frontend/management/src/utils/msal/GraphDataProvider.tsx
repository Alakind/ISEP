import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {loginRequest} from "../../AuthConfig.ts";
import {callMsGraph} from "./graph.ts";
import {AccountInfo, IPublicClientApplication} from "@azure/msal-browser";

interface GraphData {
  givenName: string;
  surname: string;
  mail: string;
}

export const GraphDataContext = createContext({
  givenName: "",
  surname: "",
  mail: ""
});

export const GraphDataProvider = ({children, activeAccount, instance}: { children: ReactNode, activeAccount: AccountInfo, instance: IPublicClientApplication }) => {
  const [graphData, setGraphData] = useState<GraphData>({
    givenName: "",
    surname: "",
    mail: ""
  });

  useEffect(() => {
    if ((graphData.mail === "" && graphData.surname === "") && activeAccount) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        })
        .then((response) => {
          callMsGraph(response.accessToken).then((data) => {
            if (data) {
              let newGivenName = data.givenName;
              if (!newGivenName && data.mail) {
                newGivenName = data.mail.replace(/@.*/i, "");
              } else if (!newGivenName) {
                console.error("No replacement for givenName");
                newGivenName = "";
              }
              setGraphData({
                givenName: newGivenName,
                surname: data.surname ?? "",
                mail: data.mail ?? "",
              });
            } else {
              console.error("Graph Data is undefined");
            }
          });
        })
        .catch((error) => {
          console.error("Error acquiring token", error);
        });
    }
  }, [activeAccount]);

  const contextValue = useMemo(() => ({givenName: graphData?.givenName, surname: graphData?.surname, mail: graphData?.mail}), [graphData]);

  return <GraphDataContext.Provider value={contextValue}>{children}</GraphDataContext.Provider>;
}

export const useGraphData = () => {
  const context = useContext(GraphDataContext);
  if (!context) {
    throw new Error("useGraphData must be used within a GraphDataProvider");
  }
  return context;
};

