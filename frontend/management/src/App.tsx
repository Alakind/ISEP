import {Outlet, useLocation, useNavigate} from "react-router-dom";
import HeaderContainer from "./containers/header/HeaderContainer.tsx";
import {ReactNode, useEffect} from "react";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import LoginPageContainer from "./containers/auth/LoginPageContainer.tsx";
import {MsUserProvider} from "./utils/msal/MsUserProvider.tsx";
import {UserProvider} from "./utils/msal/UserProvider.tsx";
import {InteractionStatus} from "@azure/msal-browser";

function App(): ReactNode {
  const {instance, inProgress} = useMsal()
  const activeAccount = instance.getActiveAccount()
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/" && inProgress == InteractionStatus.None) {
      navigate("/dashboard", {replace: true});
    }
  }, [inProgress, location, navigate]);

  return (
    <>
      <AuthenticatedTemplate>
        {
          activeAccount
            ? (
              <MsUserProvider instance={instance} activeAccount={activeAccount}>
                <UserProvider>
                  <div>
                    <HeaderContainer/>
                    <main>
                      <Outlet/>
                    </main>
                  </div>
                </UserProvider>
              </MsUserProvider>)
            : null
        }
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginPageContainer/>
      </UnauthenticatedTemplate>
    </>
  );
}

export default App;
