import {useContext} from "react";
import {UserContext} from "./UserContext.tsx";

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useMsUserData must be used within a MsUserProvider");
  }
  return context;
};