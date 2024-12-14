import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";
import "../../styles/form.css";
import "../../styles/dropdown.css";
import ToggleContainer from "../../containers/ToggleContainer.tsx";


function ApplicantInviteCard({
                               applicantData,
                               assessmentsData,
                               handleCancel,
                               handleInvite,
                               handleSelect,
                               selectedOption,
                               handleToggleMail,
                               expirationDate,
                               handleChangeExpirationDate,
                               inviteData
                             }: Props): ReactNode {
  return (
    <>
      <div className={"card-page__body--col2"}>
        <h4>Invitation settings</h4>
        <form>
          <div className={"dropdown"}>
            <label htmlFor="assessment">Assessment:</label>
            <select
              id="assessment"
              name="assessment"
              onChange={(e: ChangeEvent<HTMLSelectElement>): void => handleSelect(e)}
              defaultValue={assessmentsData[selectedOption]?.tag ?? "default"}
              className={`dropdown__select ${assessmentsData[selectedOption]?.tag == "default" ? "dropdown__select__default-option" : ""}`}
              required
            >
              <option id={"default"} value={"default"}>Choose an option</option>
              {assessmentsData.map((assessment: AssessmentInterface): ReactNode => {
                return (<option key={assessment.id} id={assessment.id} value={assessment.id}>{assessment.tag}</option>)
              })}
            </select>
          </div>
          <div>
            <label htmlFor={"mailToggle"}>Send invitation mail:</label>
            <span>OFF<ToggleContainer id={"mailToggle"} checked={true} disabled={false} functionCall={handleToggleMail}/>ON</span>
          </div>
          <div>
            <label htmlFor="name">Invitation will be valid for <b>{import.meta.env.VITE_DEFAULT_EXPIRATION_DAYS} days</b> and will expire on:</label>
            <input
              type="date"
              id="name"
              name="name"
              onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChangeExpirationDate(e)} //TODO implement expiration date
              value={expirationDate}
              autoComplete="off"
              required
            />
          </div>
        </form>
        <div className="card-page__body__btns">
          <Button handleClick={handleCancel} iconClass={"bi-x"} spanTextClass={"card-page__body__btn__text"} text={"Cancel"} activeTooltip={true}/>
          <Button handleClick={handleInvite} iconClass={"bi-send"} spanTextClass={"card-page__body__btn__text"} text={"Invite"} activeTooltip={true}
                  isDisabled={applicantData.email == "" || applicantData.email == null || inviteData.assessmentId == "0"}/>
        </div>
      </div>
      <div className={"card-page__body--col2 card-page__body__inner"}>
        <h4>Invitation mail</h4>
        <form>
          <div>
            <label htmlFor="to">To:</label>
            <input
              type="email"
              id="to"
              name="to"
              onChange={(e: ChangeEvent<HTMLInputElement>): void => console.log(e.target.value)}
              value={applicantData.email}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => console.log(e.target.value)} //TODO implement mail sending
              value={import.meta.env.VITE_STANDARD_MAIL ?? `${applicantData.name ? `Dear ${applicantData.name}` : "Dear Sir/Madame,"}, \n\nWe would like to invite you to do the following assessment %INVITE_LINK%\n\nGreetings,\nInfoSupport`}
              disabled={true}
              required
            />
          </div>
        </form>
      </div>
    </>
  )
}

interface Props {
  applicantData: ApplicantInterface;
  assessmentsData: AssessmentInterface[];
  handleCancel: () => void;
  handleInvite: () => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedOption: number;
  handleToggleMail: (checked: boolean) => void;
  expirationDate: string;
  handleChangeExpirationDate: (e: ChangeEvent<HTMLInputElement>) => void;
  inviteData: InviteInterface;
}

export default ApplicantInviteCard
