import "../../styles/dashboard.css";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import DashboardListContainer from "../../containers/dashboard/DashboardListContainer.tsx";
import "../../styles/card-page.css";
import DashboardStatisticsContainer from "../../containers/dashboard/DashboardStatisticsContainer.tsx";
import DashboardQuickLinksContainer from "../../containers/dashboard/DashboardQuickLinksContainer.tsx";
import {Dispatch, SetStateAction} from "react";
import {useUserData} from "../../utils/msal/UseUserData.tsx";
import {Roles} from "../../utils/constants.tsx";

function Dashboard({currentUser, totalApplicants, setTotalApplicants, totalWillExpire, setTotalWillExpire, totalExpired, setTotalExpired}: Readonly<Props>) {
  const user = useUserData();

  return (
    <div className={"dashboard-page"}>
      <h1> Welcome {currentUser}</h1>
      {
        user.role === Roles.ADMIN || user.role === Roles.RECRUITER || user.role === Roles.INTERVIEWER
          ? (
            <>
              <p>Welcome to the management page of Asserberus. To view applicants and their assessment results navigate to the
                Applicants page. {user.role === Roles.ADMIN && "To view the roles of users navigate to the Users page."}</p>
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
            </>
          ) : (
            <p>It seems that you don't have a role yet. Please ask an admin to assign you the appropriate role. Until then you can't access any information.</p>
          )
      }
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
