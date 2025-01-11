import {Outlet, useLocation, useNavigate} from "react-router-dom";
import HeaderContainer from "./containers/header/HeaderContainer.tsx";
import {ReactNode, useEffect} from "react";

function App(): ReactNode {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dashboard", { replace: true });
        }
    }, [location, navigate]);
    return (
    <div>
      <HeaderContainer />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
