import { useNavigate, useParams } from "react-router-dom";

import WelcomePage from "../components/WelcomePage";
import { useEffect } from "react";

function WelcomePageContainer() {
  const navigate = useNavigate();
  const { inviteId } = useParams();

  useEffect(() => {
    if (inviteId) {
      localStorage.setItem("inviteId", inviteId);
    }
  }, []);

  const handleStart = () => {
    navigate("/assessment");
  };

  return <WelcomePage handleStart={handleStart} />;
}

export default WelcomePageContainer;
