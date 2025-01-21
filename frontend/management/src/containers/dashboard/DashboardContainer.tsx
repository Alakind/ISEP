import Dashboard from "../../components/dashboard/Dashboard.tsx";
import {useState} from "react";
import {useMsUserData} from "../../utils/msal/MsUserProvider.tsx";
import {capitalizeFirstLetter} from "../../utils/general.tsx";

function DashboardContainer() {
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const [totalWillExpire, setTotalWillExpire] = useState<number>(0);
  const [totalExpired, setTotalExpired] = useState<number>(0)
  const graphData = useMsUserData();
  return (
    <Dashboard
      currentUser={capitalizeFirstLetter(graphData.givenName)}
      totalApplicants={totalApplicants}
      setTotalApplicants={setTotalApplicants}
      totalWillExpire={totalWillExpire}
      setTotalWillExpire={setTotalWillExpire}
      totalExpired={totalExpired}
      setTotalExpired={setTotalExpired}
    />
  )
}

export default DashboardContainer
