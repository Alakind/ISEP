import ProfileButton from "../../components/header/ProfileButton.tsx";

function ProfileButtonContainer({urlPrefix} : Props) {
  return (
    <ProfileButton urlPrefix={urlPrefix} currentUser={"Jurre"}/>
  )
}

interface Props {
  urlPrefix: string;
}

export default ProfileButtonContainer
