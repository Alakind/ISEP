import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {useMsUserData} from "./MsUserProvider.tsx";
import {UserInterface} from "../types.tsx";
import {Roles} from "../constants.tsx";
import {mapRole} from "../mapping.tsx";
import {addUser, getUserOid, updateUser} from "../apiFunctions.tsx";
import {toast} from "react-toastify";
import {useMsal} from "@azure/msal-react";
import {capitalizeFirstLetter} from "../general.tsx";


export const UserContext = createContext({
  name: "",
  email: "",
  role: "",
  id: "",
  oid: ""
});

export const UserProvider = ({children}: { children: ReactNode }) => {
  const {instance} = useMsal();
  const msUserContext = useMsUserData()

  const [userData, setUserData] = useState<UserInterface>({
    name: "",
    email: "",
    role: mapRole(Roles.NO_ACCESS),
    id: "",
    oid: msUserContext.oid
  });

  function updateUserWithMsUserData(data: UserInterface, fullName: string) {
    const updateUserData: Partial<UserInterface> = {};
    if (fullName.trim() !== "" && fullName !== data.name) {
      updateUserData["name"] = fullName
    }
    if (msUserContext.mail !== "" && msUserContext.mail !== data.email) {
      updateUserData["email"] = msUserContext.mail
    }

    updateUser(data.id, updateUserData).catch(() => {
      toast.error("Error updating user data");
    })
  }

  function addUserWithMsUserData(fullName: string, oid: string) {
    const addUserData: Partial<UserInterface> = {};
    if (fullName.trim() !== "") {
      addUserData["name"] = fullName
    } else if (msUserContext.mail !== "") {
      addUserData["name"] = msUserContext.mail.replace(/@.*/i, "")
    } else {
      addUserData["name"] = "Unknown"
    }

    if (msUserContext.mail !== "") {
      addUserData["email"] = msUserContext.mail
    } else {
      addUserData["email"] = "Unknown"
    }
    if (oid !== "") {
      addUserData["oid"] = oid
    } else {
      toast.error("Could not add user data, because missing oid. You will be logged out.");

      setTimeout(() => {
        instance.logoutRedirect({postLogoutRedirectUri: "/",}).then()
      }, 3000);
      return;
    }
    addUser(addUserData).then(() => toast.success("New user has been added"));
  }

  useEffect(() => {
    const oid = msUserContext.oid
    if (oid !== "") {
      const fullName = `${capitalizeFirstLetter(msUserContext.givenName)} ${capitalizeFirstLetter(msUserContext.surname)}`
      getUserOid(oid).then((response: UserInterface) => {
        setUserData({
          id: response.id,
          name: response.name,
          email: response.email,
          oid: response.oid,
          role: response.role ?? Roles.NO_ACCESS
        });
        updateUserWithMsUserData(response, fullName)
      }).catch((e: Error) => {
        if (e.message.includes("Failed to retrieve user with oid")) {
          addUserWithMsUserData(fullName, oid)
        }
      });
    }
  }, [msUserContext.oid]);

  const contextValue = useMemo(() => ({name: userData.name, email: userData.email, role: userData.role, id: userData.id, oid: userData.oid}), [userData]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useMsUserData must be used within a MsUserProvider");
  }
  return context;
};

