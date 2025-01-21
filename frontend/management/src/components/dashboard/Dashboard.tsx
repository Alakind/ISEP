import "../../styles/dashboard.css";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import DashboardListContainer from "../../containers/dashboard/DashboardListContainer.tsx";
import "../../styles/card-page.css";
import DashboardStatisticsContainer from "../../containers/dashboard/DashboardStatisticsContainer.tsx";
import DashboardQuickLinksContainer from "../../containers/dashboard/DashboardQuickLinksContainer.tsx";
import {Dispatch, SetStateAction} from "react";

function Dashboard({currentUser, totalApplicants, setTotalApplicants, totalWillExpire, setTotalWillExpire, totalExpired, setTotalExpired}: Readonly<Props>) {
  return (
    <div className={"dashboard-page"}>
      <h1> Welcome {currentUser}</h1>
      <p>Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the
        Applicants page. To view the roles of users navigate to the Users page.</p>
      <div>
        <div className={"dashboard-page__flex"}>
          <div className={"dashboard-page__flex__left"}>
            <CardBodyContainer additionalClass={"card-page__body--mod"}>
              <DashboardStatisticsContainer
                totalApplicants={totalApplicants}
                totalWillExpire={totalWillExpire}
                totalExpired={totalExpired}
              />
            </CardBodyContainer>
          </div>

          <div className={"dashboard-page__flex__right"}>
            <CardBodyContainer>
              <DashboardQuickLinksContainer/>
            </CardBodyContainer>
          </div>
        </div>
        <div>
          <DashboardListContainer
            setTotalApplicants={setTotalApplicants}
            setTotalWillExpire={setTotalWillExpire}
            setTotalExpired={setTotalExpired}
          />
        </div>
      </div>

    </div>
  )
}

interface Props {
  currentUser: string;
  totalApplicants: number;
  setTotalApplicants: Dispatch<SetStateAction<number>>;
  totalWillExpire: number;
  setTotalWillExpire: Dispatch<SetStateAction<number>>;
  totalExpired: number;
  setTotalExpired: Dispatch<SetStateAction<number>>;
}

export default Dashboard
