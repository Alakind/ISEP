import {loginRequest} from "../../AuthConfig.ts";
import {useMsal} from "@azure/msal-react";

function LoginPageContainer() {
  const {instance} = useMsal()

  const handleRedirect = () => {
    instance.loginRedirect({...loginRequest, prompt: 'create'}).catch(error => console.log(error));
  }

  return (
    <button onClick={handleRedirect}>Login</button>
  )
}

export default LoginPageContainer
