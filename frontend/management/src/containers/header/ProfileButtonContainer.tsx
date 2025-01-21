import ProfileButton from "../../components/header/ProfileButton.tsx";
import {ReactNode} from "react";
import {useMsal} from "@azure/msal-react";
import {useMsUserData} from "../../utils/msal/MsUserProvider.tsx";
import {capitalizeFirstLetter} from "../../utils/general.tsx";

function ProfileButtonContainer(): ReactNode {
  const {instance} = useMsal();
  const user = useMsUserData()

  function handleLogout() {
    instance.logoutRedirect({postLogoutRedirectUri: "/",}).then()
  }


  return (
    <ProfileButton
      currentUser={user.surname !== "" ? `${capitalizeFirstLetter(user.givenName)} ${capitalizeFirstLetter(user.surname)}` : capitalizeFirstLetter(user.givenName) ?? "-"}
      handleLogout={handleLogout}/>
  )
}

export default ProfileButtonContainer