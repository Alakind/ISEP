import { Outlet } from "react-router-dom";
import HeaderContainer from "./containers/header/HeaderContainer.tsx";
import {ReactNode} from "react";

function App(): ReactNode {
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
