import StatusItem from "../StatusItem.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import {AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import "../../styles/invites-overview.css";
import "../../styles/form.css";
import {ChangeEvent, MouseEvent, ReactNode} from "react";
import Button from "../Button.tsx";
import {canCancelInvite, canDeleteInvite, canRemindInvite} from "../../utils/general.tsx";
import {InviteStatuses, Roles} from "../../utils/constants.tsx";
import {useUserData} from "../../utils/msal/UserProvider.tsx";

function InvitesOverview({invitesData, assessmentsData, handleChangeExpirationDate, expirationDates, handleCancel, handleDelete, handleRemind}: Readonly<Props>) {
  const user = useUserData();
  return (
    <span className="invites-overview card-page__body--col2" data-testid={"invites-overview"}>
      <h4>Invites overview</h4>
      <div className="invites-overview__body">
        {
          invitesData.length > 0 ?
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
                    {
                      mapStatus(invite.status) === InviteStatuses.NOT_STARTED || mapStatus(invite.status) === InviteStatuses.APP_REMINDED_ONCE || mapStatus(invite.status) === InviteStatuses.APP_REMINDED_TWICE
                        ? (
                          <form>
                            <div>
                              <label className={"invites-overview__body__item__label"} htmlFor={`expirationDate_${invite.id}`}>Available till: </label>
                              <input
                                type="date"
                                id={`expirationDate_${invite.id}`}
                                name="expirationDate"
                                onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChangeExpirationDate(e, index)}
                                value={expirationDates[index]}
                                autoComplete="off"
                                disabled={user.role === Roles.ADMIN || user.role === Roles.RECRUITER ? !canRemindInvite(mapStatus(invite.status)) : true}
                                required
                              />
                            </div>
                          </form>
                        ) : (
                          <>
                            {
                              mapStatus(invite.status) === InviteStatuses.APP_FINISHED
                                ? (
                                  <>
                                    <div>
                                      <label className={"invites-overview__body__item__label"} htmlFor={`expirationDate_${invite.id}`}>Start date: </label>
                                      <span>{invite.assessmentStartedAt ? new Date(invite.assessmentStartedAt).toLocaleString() : "-"}</span>
                                    </div>
                                    <div>
                                      <label className={"invites-overview__body__item__label"} htmlFor={`expirationDate_${invite.id}`}>Finish date: </label>
                                      <span>{invite.assessmentFinishedAt ? new Date(invite.assessmentFinishedAt).toLocaleString() : "-"}</span>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )
                            }
                          </>
                        )
                    }
                    {
                      user.role === Roles.ADMIN || user.role === Roles.RECRUITER
                        ? (
                          <div className="invites-overview__body__item__btns">
                            <Button
                              handleClick={(e: MouseEvent<HTMLButtonElement>): void => handleCancel(e, invite.id)}
                              iconClass={"bi-x"}
                              spanTextClass={"invites-overview__body__item__btn__text"}
                              btnClasses={"invites-overview__body__item__btn"}
                              text={"Cancel"}
                              activeTooltip={true}
                              isDisabled={!canCancelInvite(mapStatus(invite.status))}
                            />
                            <Button
                              handleClick={(e: MouseEvent<HTMLButtonElement>) => handleDelete(e, invite.id)}
                              iconClass={"bi-trash"}
                              spanTextClass={"invites-overview__body__item__btn__text"}
                              btnClasses={"invites-overview__body__item__btn"}
                              text={"Delete"}
                              activeTooltip={true}
                              isDisabled={!canDeleteInvite(mapStatus(invite.status))}
                            />
                            <Button
                              handleClick={(e: MouseEvent<HTMLButtonElement>): void => handleRemind(e, invite.id)}
                              iconClass={"bi-envelope"}
                              spanTextClass={"invites-overview__body__item__btn__text"}
                              btnClasses={"invites-overview__body__item__btn"}
                              text={"Remind"}
                              activeTooltip={true}
                              isDisabled={!canRemindInvite(mapStatus(invite.status))}
                            />
                          </div>
                        ) : null
                    }
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
  handleCancel: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
  handleDelete: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
  handleRemind: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default InvitesOverview
