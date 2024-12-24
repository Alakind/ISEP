import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import "../../styles/invites-overview.css";
import {ReactNode} from "react";

function InvitesOverview({invitesData, assessmentsData}: Props) {
  return (
    <span className="invites-overview card-page__body--col2">
      <h4>Invites overview</h4>
      <div className="invites-overview__body">
        {
          invitesData.length > 0 ?
            invitesData.map((invite: InviteInterface, index: number): ReactNode => {
              const expirationDate = new Date(invite.expiresAt)
              return (
                <div key={index} className={"invites-overview__body__item"}>
                  <div>
                    <span className={"invites-overview__body__item__label"}>Assessment:</span><span>{assessmentsData[index]?.tag}</span>
                  </div>
                  <div>
                    {/*TODO make this a form to edit the expiration date*/}
                    <span className={"invites-overview__body__item__label"}>Available till:</span><span>{expirationDate.toDateString()}</span>
                  </div>
                  <div>
                    <span className={"invites-overview__body__item__label"}>Status:</span><StatusItem status={mapStatus(invite.status)}/>
                  </div>
                </div>
              )
            }) :
            <span>No invites available.</span>
        }
      </div>
    </span>
  )
}

interface Props {
  invitesData: InviteInterface[];
  assessmentsData: AssessmentInterface[];
}

export default InvitesOverview
