import "../../styles/dashboard.css";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import DashboardListContainer from "../../containers/dashboard/DashboardListContainer.tsx";
import "../../styles/card-page.css";
import DashboardStatisticsContainer from "../../containers/dashboard/DashboardStatisticsContainer.tsx";
import DashboardQuicklinksContainer from "../../containers/dashboard/DashboardQuicklinksContainer.tsx";

function Dashboard({}: Readonly<Props>) {
  return (
    <div className={"dashboard-page"}>
      <h1> Welcome Jurre</h1>
      <p>Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the
        Applicants page. To view the roles of users navigate to the Users page.</p>
      <div>
        <div className={"dashboard-page__flex"}>
          <div className={"dashboard-page__flex__left"}>
            <CardBodyContainer>
              <DashboardStatisticsContainer/>
            </CardBodyContainer>
          </div>

          <div className={"dashboard-page__flex__right"}>
            <CardBodyContainer>
              <DashboardQuicklinksContainer/>
            </CardBodyContainer>
          </div>
        </div>
        <div>
          <DashboardListContainer/>
        </div>
      </div>

    </div>
  )
}

interface Props {
}

export default Dashboard
