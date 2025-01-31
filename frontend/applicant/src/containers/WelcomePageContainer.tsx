import {useNavigate, useParams} from "react-router-dom";

import WelcomePage from "../components/WelcomePage";
import {useEffect, useState} from "react";
import {getPreInfo} from "../utils/apiFunctions.tsx";
import {PreInfoInterface} from "../utils/types.tsx";

function WelcomePageContainer() {
  const navigate = useNavigate();
  const {inviteId} = useParams();
  const [preInfo, setPreInfo] = useState<PreInfoInterface>({name: "", availableSeconds: 0});

  useEffect(() => {
    if (inviteId) {
      localStorage.setItem("inviteId", inviteId);

      getPreInfo(inviteId).then(r => {
        setPreInfo(r);
        localStorage.setItem("name", r.name)
      });
    }
  }, []);

  const handleStart = () => {
    navigate("/assessment");
  };

  return <WelcomePage handleStart={handleStart} inviteId={inviteId ?? null} name={preInfo.name} availableSeconds={preInfo.availableSeconds}/>;
}

export default WelcomePageContainer;
