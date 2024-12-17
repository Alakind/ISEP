import {ApplicantInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";
import "../../styles/form.css"

function ApplicantAddCard({newApplicant, handleCancel, handleAdd, handleChange}: Props): ReactNode {
  return (
    <div>
      <form>
        <div>
          <label htmlFor={"name"}>Name:</label>
          <input
            type="text"
            id={"name"}
            name="name"
            value={newApplicant.name}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
            autoFocus
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor={"email"}>Email:</label>
          <input
            type="email"
            id={"email"}
            name="email"
            value={newApplicant.email}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor={"preferredLanguage"}>Preferred language:</label>
          <input
            type="text"
            id={"preferredLanguage"}
            name="preferredLanguage"
            value={newApplicant.preferredLanguage.toString()}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(e)}
          />
        </div>
      </form>
      <div className="card-page__body__btns">
        <Button
          handleClick={handleCancel}
          iconClass={"bi-x"}
          spanTextClass={"card-page__body__btn__text"}
          text={"Cancel"}
          activeTooltip={true}
        />
        <Button handleClick={(): void => handleAdd(false)}
                iconClass={"bi-person-add"}
                spanTextClass={"card-page__body__btn__text"}
                text={"Add"}
                activeTooltip={true}
        />
        <Button handleClick={(): void => handleAdd(true)}
                iconClass={"bi-send"}
                spanTextClass={"card-page__body__btn__text"}
                text={"Add & Invite"}
                activeTooltip={true}
        />
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
