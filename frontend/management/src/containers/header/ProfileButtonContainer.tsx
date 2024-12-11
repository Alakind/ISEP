import ProfileButton from "../../components/header/ProfileButton.tsx";
import {ReactNode} from "react";

function ProfileButtonContainer({urlPrefix}: Props): ReactNode {
  return (
    <ProfileButton urlPrefix={urlPrefix} currentUser={"Jurre"}/>
  )
}

interface Props {
  urlPrefix: string;
}

export default ProfileButtonContainer