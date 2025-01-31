import {createContext} from "react";

export const MsUserContext = createContext({
  givenName: "",
  surname: "",
  mail: "",
  oid: ""
});