import "../../styles/dashboard.css";
import {ApplicantInterface, InviteInterface} from "../../utils/types.tsx";
import {ReactNode} from "react";
import InvitesTableContainer from "../../containers/dashboard/InvitesTableContainer.tsx";
import {dashboardExpiredColumns, dashboardFinishedColumns, dashboardWillExpireColumns} from "../../utils/constants.tsx";

function DashboardList({
                         dataApplicants,
                         dataFinished,
                         dataExpired,
                         dataWillExpire
                       }: Readonly<Props>): ReactNode {
  return (
    <div>
      <h4>Finished assessments in the last week</h4>
      <hr></hr>
      {dataFinished.length !== 0
        ? (
          <InvitesTableContainer data={dataFinished} dataApplicants={dataApplicants} columns={dashboardFinishedColumns}/>
        ) : (
          <p>No data available</p>
        )
      }
      {dataExpired.length !== 0
        ? (
          <>
            <h4>Expired invites</h4>
            <hr></hr>
            <InvitesTableContainer data={dataExpired} dataApplicants={dataApplicants} columns={dashboardExpiredColumns}/>
          </>
        ) : (
          <></>
        )
      }
      {dataWillExpire.length !== 0
        ? (
          <>
            <h4>Invites that will expire in 2 days</h4>
            <hr></hr>
            <InvitesTableContainer data={dataWillExpire} dataApplicants={dataApplicants} columns={dashboardWillExpireColumns}/>
          </>
        ) : (
          <></>
        )
      }
    </div>
  )
}

interface Props {
  dataApplicants: ApplicantInterface[];
  dataFinished: InviteInterface[];
  dataExpired: InviteInterface[];
  dataWillExpire: InviteInterface[];
}

export default DashboardList
