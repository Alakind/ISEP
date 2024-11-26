import { Outlet } from "react-router-dom";
import HeaderContainer from "./containers/HeaderContainer";

function App() {
  return (
    <div>
      <header>
        <HeaderContainer />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
