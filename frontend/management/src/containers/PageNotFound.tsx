import "../styles/general.css";
import {Link} from "react-router-dom";
import {ReactNode} from "react";
import HeaderContainer from "./header/HeaderContainer.tsx";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";

function PageNotFound(): ReactNode {
  const {instance} = useMsal();
  const activeAccount = instance.getActiveAccount()
  const isAuthenticated = useIsAuthenticated();
  const authenticated = activeAccount && isAuthenticated;
  return (
    <div>
      {authenticated && <HeaderContainer/>}
      <main>
        <div className="page page--center" data-testid={"page-not-found"}>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            Sorry, the page you are looking for does not exist. <br></br>
            You can go back to the <Link to={"/dashboard"}>dashboard</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default PageNotFound
