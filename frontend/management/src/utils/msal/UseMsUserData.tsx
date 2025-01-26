import {useContext} from "react";
import {MsUserContext} from "./MsUserContext.tsx";

export const useMsUserData = () => {
  const context = useContext(MsUserContext);
  if (!context) {
    throw new Error("useMsUserData must be used within a MsUserProvider");
  }
  return context;
};