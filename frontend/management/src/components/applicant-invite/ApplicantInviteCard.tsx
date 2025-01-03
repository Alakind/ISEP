import {AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";
import "../../styles/form.css";
import "../../styles/dropdown.css";
import ToggleContainer from "../../containers/ToggleContainer.tsx";


function ApplicantInviteCard({
                               applicantEmail,
                               applicantName,
                               assessmentsData,
                               handleCancel,
                               handleInvite,
                               handleSelect,
                               selectedOption,
                               handleToggleMail,
                               handleChangeExpirationDate,
                               inviteData,
                               expirationDate,
                               toggleValue,
                               handleChangeEmail,
                               editingEmail,
                               handleEditingEmail,
                               handleCancelEditingEmail
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
            <span>OFF<ToggleContainer id={"mailToggle"} disabled={false} handleChange={handleToggleMail} toggleValue={toggleValue}/>ON</span>
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
                  isDisabled={applicantEmail == "" || applicantEmail == null || inviteData.assessmentId == "0"}/>
        </div>
      </div>
      <div className={"card-page__body--col2 card-page__body__inner"}>
        <h4>Invitation mail</h4>
        <form>
          <div>
            <label htmlFor="to">To:</label>
            <span>
              <input
                type="email"
                id="to"
                name="to"
                className={`input-email`}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChangeEmail(e)}
                value={applicantEmail}
                autoComplete="off"
                disabled={!editingEmail}
                required
              />
              {
                editingEmail ?
                  <a onClick={(): void => handleCancelEditingEmail()} className={`input-email--edit ${!toggleValue ? "input-email--disabled" : ""}`}>
                    <i className={"bi bi-x-lg"}></i>
                  </a> :
                  <></>
              }
              <a onClick={(): void => handleEditingEmail()} className={`input-email--edit ${!toggleValue ? "input-email--disabled" : ""}`}>
                {
                  editingEmail ?
                    <i className="bi bi-floppy"></i> :
                    <i className={`bi bi-pencil ${!toggleValue ? "i--disabled" : ""}`}></i>
                }
              </a>
            </span>
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => console.log(e.target.value)} //TODO implement mail sending
              value={import.meta.env.VITE_STANDARD_MAIL ?? `${applicantName ? `Dear ${applicantName}` : "Dear applicant"}, \n\nWe would like to invite you to do the following assessment %INVITE_LINK%\n\nGreetings,\nInfoSupport`}
              disabled={!toggleValue}
              required
            />
          </div>
        </form>
      </div>
    </>
  )
}

interface Props {
  applicantEmail: string;
  applicantName: string;
  assessmentsData: AssessmentInterface[];
  handleCancel: () => void;
  handleInvite: () => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedOption: number;
  handleToggleMail: () => void;
  expirationDate: string;
  handleChangeExpirationDate: (e: ChangeEvent<HTMLInputElement>) => void;
  inviteData: InviteInterface;
  toggleValue: boolean;
  handleChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  editingEmail: boolean;
  handleEditingEmail: () => void;
  handleCancelEditingEmail: () => void;
}

export default ApplicantInviteCard
