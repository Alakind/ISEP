import Dashboard from "../../components/dashboard/Dashboard.tsx";
import {useState} from "react";
import {useUserData} from "../../utils/msal/UseUserData.tsx";

function DashboardContainer() {
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const [totalWillExpire, setTotalWillExpire] = useState<number>(0);
  const [totalExpired, setTotalExpired] = useState<number>(0)
  const user = useUserData();

  return (
    <Dashboard
      currentUser={user.name}
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
