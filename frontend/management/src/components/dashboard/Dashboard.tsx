import "../../styles/dashboard.css";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import DashboardListContainer from "../../containers/dashboard/DashboardListContainer.tsx";
import "../../styles/card-page.css";
import DashboardStatisticsContainer from "../../containers/dashboard/DashboardStatisticsContainer.tsx";
import DashboardQuickLinksContainer from "../../containers/dashboard/DashboardQuickLinksContainer.tsx";
import {Dispatch, SetStateAction} from "react";

function Dashboard({totalItems, setTotalItems}: Readonly<Props>) {
  return (
    <div className={"dashboard-page"}>
      <h1> Welcome Jurre</h1>
      <p>Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the
        Applicants page. To view the roles of users navigate to the Users page.</p>
      <div>
        <div className={"dashboard-page__flex"}>
          <div className={"dashboard-page__flex__left"}>
            <CardBodyContainer additionalClass={"card-page__body--mod"}>
              <DashboardStatisticsContainer totalItems={totalItems}/>
            </CardBodyContainer>
          </div>

          <div className={"dashboard-page__flex__right"}>
            <CardBodyContainer>
              <DashboardQuickLinksContainer/>
            </CardBodyContainer>
          </div>
        </div>
        <div>
          <DashboardListContainer totalItems={totalItems} setTotalItems={setTotalItems}/>
        </div>
      </div>

    </div>
  )
}

interface Props {
  totalItems: number;
  setTotalItems: Dispatch<SetStateAction<number>>
}

export default Dashboard
