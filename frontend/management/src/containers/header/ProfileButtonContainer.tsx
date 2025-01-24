import ProfileButton from "../../components/header/ProfileButton.tsx";
import {ReactNode} from "react";
import {useMsal} from "@azure/msal-react";
import {useUserData} from "../../utils/msal/UseUserData.tsx";

function ProfileButtonContainer(): ReactNode {
  const {instance} = useMsal();
  const user = useUserData();

  function handleLogout() {
    instance.logoutRedirect({postLogoutRedirectUri: "/",}).then()
  }

  return (
    <ProfileButton
      currentUser={user.name ?? "-"}
      currentRole={user.role ?? "-"}
      handleLogout={handleLogout}/>
  )
}

export default ProfileButtonContainer