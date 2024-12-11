import {ApplicantInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";

function ApplicantAddCard({newApplicant, handleCancel, handleAdd, handleChange}: Props): ReactNode {
  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newApplicant.name}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={newApplicant.email}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
            required
          />
        </div>
        <div>
          <label>Preferred language:</label>
          <input
            type="text"
            name="preferredLanguage"
            value={newApplicant.preferredLanguage.toString()}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
          />
        </div>
      </form>
      <div className="applicant-add__btns">
        <Button handleClick={handleCancel} iconClass={"bi-x"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Cancel"} activeTooltip={true}/>
        <Button handleClick={(): void => handleAdd(false)} iconClass={"bi-person-add"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Add"} activeTooltip={true}/>
        <Button handleClick={(): void => handleAdd(true)} iconClass={"bi-person-lines-fill"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Add & Invite"}
                activeTooltip={true}/>
      </div>
    </div>
  )
}

interface Props {
  newApplicant: ApplicantInterface;
  handleCancel: () => void;
  handleAdd: (goToInvite: boolean) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default ApplicantAddCard
