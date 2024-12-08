import { Outlet } from "react-router-dom";
import HeaderContainer from "./containers/header/HeaderContainer.tsx";

function App() {
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
