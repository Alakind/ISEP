import { ApplicantInterface } from "../../utils/types.tsx";
import Button from "../Button.tsx";
import "../../styles/applicant-card.css";

function ApplicantCard({ applicant, handleChange, handleRemind, handleReInvite, handleEdit, handleDelete, isEditing, handleSave, handleCancel  }: Props) {
  return (
    <div>
      <form >
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            disabled={!isEditing}
            value={applicant.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            disabled={!isEditing}
            value={applicant.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Preferred language:</label>
          <input
            type="text"
            name="preferredLanguage"
            disabled={!isEditing}
            value={applicant.preferredLanguage.toString()}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Invite link:</label>
          <input
            type="text"
            name="invite"
            disabled={true}
            value={applicant.invite ?? '-'}
            onChange={handleChange}
          />
        </div>
      </form>
      <div className="applicant-card__btns">
        {isEditing ?
          <>
            <Button handleClick={handleCancel} iconClass={"bi-x"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Cancel"} activeTooltip={true}/>
            <Button handleClick={handleSave} iconClass={"bi-floppy"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Save"} activeTooltip={true}/>
          </>
           :
          <>
            <Button handleClick={handleEdit} iconClass={"bi-pencil"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Edit"} activeTooltip={true}/>
            <Button handleClick={handleDelete} iconClass={"bi-trash"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Delete"} activeTooltip={true}/>
            <Button handleClick={handleRemind} iconClass={"bi-bell"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Send reminder"} activeTooltip={true}/>
            <Button handleClick={handleReInvite} iconClass={"bi-envelope"} btnClasses={"applicant-card__btn"} spanTextClass={"applicant-card__btn__text"} text={"Resend invite"} activeTooltip={true}/>
          </>
        }
      </div>
    </div>
  );
}

interface Props {
  applicant: ApplicantInterface;
  handleChange: (arg0 : any) => void;
  handleRemind: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleReInvite: () => void;
  isEditing: boolean;
  handleSave: (applicant: ApplicantInterface) => void;
  handleCancel: () => void;
}

export default ApplicantCard;
