import ProfileButton from "../../components/header/ProfileButton.tsx";
import {ReactNode} from "react";
import {useMsal} from "@azure/msal-react";

function ProfileButtonContainer(): ReactNode {
  const {instance} = useMsal();

  function handleLogout() {
    instance.logoutRedirect({postLogoutRedirectUri: "/",}).then()
  }

  return (
    <ProfileButton currentUser={"Jurre"} handleLogout={handleLogout}/>
  )
}

export default ProfileButtonContainer