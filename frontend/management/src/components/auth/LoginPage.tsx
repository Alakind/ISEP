import Button from "../Button.tsx";
import "../../styles/login-page.css";
import InfoSupportLogo from "../InfoSupportLogo.tsx";

function LoginPage({handleRedirect}: Readonly<Props>) {
  return (
    <div className={"page page--center"}>
      <InfoSupportLogo></InfoSupportLogo>
      <p className={"login__main-header"}>InfoSupport</p>
      <i className={"login__sub-header"}>Asserberus</i>
      <p className={"login__info-box"}>A pre job interview assessment application for future employees of the InfoSupport company. Please login in with your InfoSupport employee credentials. By
        initial login, request an admin to
        assign you the proper role(s).</p>
      <Button handleClick={handleRedirect} text={"Login"} spanTextClass={""} btnClasses={"login__btn"} iconClass={"bi-microsoft"}/>
    </div>
  )
}

interface Props {
  handleRedirect: () => void;
}

export default LoginPage
