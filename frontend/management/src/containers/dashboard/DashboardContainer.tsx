import Dashboard from "../../components/dashboard/Dashboard.tsx";
import {useState} from "react";

function DashboardContainer() {
  const [totalItems, setTotalItems] = useState<number>(0);
  return (
    <Dashboard totalItems={totalItems} setTotalItems={setTotalItems}/>
  )
}

export default DashboardContainer
