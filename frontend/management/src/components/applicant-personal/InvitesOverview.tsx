import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import "../../styles/invites-overview.css";
import "../../styles/form.css";
import {ChangeEvent, ReactNode} from "react";

function InvitesOverview({invitesData, assessmentsData, handleChangeExpirationDate, expirationDates}: Readonly<Props>) {
  return (
    <span className="invites-overview card-page__body--col2" data-testid={"invites-overview"}>
      <h4>Invites overview</h4>
      <div className="invites-overview__body">
        {
          invitesData.length > 0 || expirationDates.length > 0 ?
            invitesData.map((invite: InviteInterface, index: number): ReactNode => {
              return (
                <div key={invite.id} className={"invites-overview__body__item"}>
                  <div>
                    <b>{assessmentsData[index]?.tag}:</b>
                  </div>
                  <div>
                    <span className={"invites-overview__body__item__label"}>Status:</span>
                    <StatusItem status={mapStatus(invite.status)} additionalClass={"status-item--invite"}/>
                  </div>
                  <div className={"invites-overview__body__item__expiration-date"}>
                    <form>
                      <div>
                        <label className={"invites-overview__body__item__label"} htmlFor={`expirationDate_${invite.id}`}>Available till: </label>
                        <input
                          type="date"
                          id={`expirationDate_${invite.id}`}
                          name="expirationDate"
                          onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChangeExpirationDate(e, index)} //TODO implement expiration date
                          value={expirationDates[index]}
                          autoComplete="off"
                          min={invitesData[index].expiresAt}
                          required
                        />
                      </div>
                    </form>
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
  handleChangeExpirationDate: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  expirationDates: string[];
}

export default InvitesOverview
