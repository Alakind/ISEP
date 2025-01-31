import {createContext} from "react";

export const UserContext = createContext({
  name: "",
  email: "",
  role: "",
  id: "",
  oid: ""
});