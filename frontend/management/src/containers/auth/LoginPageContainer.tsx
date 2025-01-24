import {loginRequest} from "../../AuthConfig.ts";
import {useMsal} from "@azure/msal-react";
import LoginPage from "../../components/auth/LoginPage.tsx";

function LoginPageContainer() {
  const {instance} = useMsal()

  const handleRedirect = () => {
    instance.loginRedirect({...loginRequest, prompt: 'create'}).catch(error => console.log(error));
  }

  return (
    <LoginPage handleRedirect={handleRedirect}/>
  )
}

export default LoginPageContainer
