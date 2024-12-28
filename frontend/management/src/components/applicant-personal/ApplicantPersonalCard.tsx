import {ApplicantInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";
import "../../styles/form.css";

function ApplicantPersonalCard({applicant, handleChange, handleReInvite, handleEdit, handleDelete, isEditing, handleSave, handleCancel}: Props): ReactNode {
  return (
    <div className={"card-page__body--col2"}>
      <h4>Applicant details</h4>
      <form id={`form_${applicant.id}`}>
        <div>
          <label htmlFor={"name"}>Name:</label>
          <input
            type="text"
            id={"name"}
            name="name"
            disabled={!isEditing}
            value={applicant.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor={"email"}>Email:</label>
          <input
            type="email"
            id={"email"}
            name="email"
            disabled={!isEditing}
            value={applicant.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor={"preferredLanguage"}>Preferred language:</label>
          <input
            type="text"
            id={"preferredLanguage"}
            name="preferredLanguage"
            disabled={!isEditing}
            value={applicant.preferredLanguage.toString()}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
            autoComplete="off"
          />
        </div>
      </form>
      <div className="card-page__body__btns">
        {isEditing ?
          <>
            <Button handleClick={handleCancel} iconClass={"bi-x"} spanTextClass={"card-page__body__btn__text"} text={"Cancel"} activeTooltip={true}/>
            <Button handleClick={handleSave} iconClass={"bi-floppy"} spanTextClass={"card-page__body__btn__text"} text={"Save"} activeTooltip={true}/>
          </>
          :
          <>
            <Button handleClick={handleEdit} iconClass={"bi-pencil"} spanTextClass={"card-page__body__btn__text"} text={"Edit"} activeTooltip={true}/>
            <Button handleClick={handleDelete} iconClass={"bi-trash"} spanTextClass={"card-page__body__btn__text"} text={"Delete"} activeTooltip={true}/>
            <Button handleClick={handleReInvite} iconClass={"bi-envelope"} spanTextClass={"card-page__body__btn__text"} text={"Invite"} activeTooltip={true}/>
          </>
        }
      </div>
    </div>
  );
}

interface Props {
  applicant: ApplicantInterface;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleReInvite: () => void;
  isEditing: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}

export default ApplicantPersonalCard;
