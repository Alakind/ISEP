import {ApplicantInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";

function ApplicantAddCard({newApplicant, handleCancel, handleAdd, handleChange}: Props) {
  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newApplicant.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={newApplicant.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Preferred language:</label>
          <input
            type="text"
            name="preferredLanguage"
            value={newApplicant.preferredLanguage.toString()}
            onChange={handleChange}
          />
        </div>
      </form>
      <div className="applicant-add__btns">
        <Button handleClick={handleCancel} iconClass={"bi-x"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Cancel"} activeTooltip={true}/>
        <Button handleClick={() => handleAdd(false)} iconClass={"bi-person-add"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Add"} activeTooltip={true}/>
        <Button handleClick={() => handleAdd(true)} iconClass={"bi-person-lines-fill"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Add & Invite"} activeTooltip={true}/>
      </div>
    </div>
  )
}

interface Props {
  newApplicant: ApplicantInterface;
  handleCancel: () => void;
  handleAdd: (arg0: boolean) => void;
  handleChange: (e: any) => void;
}

export default ApplicantAddCard
