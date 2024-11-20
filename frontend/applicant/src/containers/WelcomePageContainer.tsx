import { useNavigate } from "react-router-dom";

import WelcomePage from "../components/WelcomePage";

function WelcomePageContainer() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/assessment");
  };

  return <WelcomePage handleStart={handleStart} />;
}

export default WelcomePageContainer;
