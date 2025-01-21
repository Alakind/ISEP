import {Outlet, useLocation, useNavigate} from "react-router-dom";
import HeaderContainer from "./containers/header/HeaderContainer.tsx";
import {ReactNode, useEffect} from "react";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import LoginPageContainer from "./containers/auth/LoginPageContainer.tsx";

function App(): ReactNode {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard", {replace: true});
    }
  }, [location, navigate]);

  const {instance} = useMsal()
  const activeAccount = instance.getActiveAccount()

  return (
    <>
      <AuthenticatedTemplate>
        {
          activeAccount
            ? (
              <div>
                <HeaderContainer/>
                <main>
                  <Outlet/>
                </main>
              </div>
            )
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
