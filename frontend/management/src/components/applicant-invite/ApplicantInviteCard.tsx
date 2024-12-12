import {ApplicantInterface, AssessmentInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";
import {ChangeEvent, ReactNode} from "react";
import "../../styles/form.css";

function ApplicantInviteCard({applicantData, assessmentsData, handleCancel, handleInvite, handleSelect, selectedOption}: Props): ReactNode {
  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={applicantData.name}
            disabled
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={applicantData.email}
            disabled
          />
        </div>
        <div>
          <label>Assessment:</label>
          <select
            name="assessment"
            onChange={(e: ChangeEvent<HTMLSelectElement>): void => handleSelect(e)}
            defaultValue={assessmentsData[selectedOption]?.tag ?? 0}
          >
            {assessmentsData.map((assessment: AssessmentInterface) => {
              return (<option key={assessment.id} id={assessment.id} value={assessment.id}>{assessment.tag}</option>)
            })}
          </select>
        </div>
      </form>
      <div className="card-page__body__btns">
        <Button handleClick={handleCancel} iconClass={"bi-x"} spanTextClass={"applicant-add__btn__text"} text={"Cancel"} activeTooltip={true}/>
        <Button handleClick={handleInvite} iconClass={"bi-person-lines-fill"} spanTextClass={"applicant-add__btn__text"} text={"Invite"} activeTooltip={true}/>
      </div>
    </div>
  )
}

interface Props {
  applicantData: ApplicantInterface;
  assessmentsData: AssessmentInterface[];
  handleCancel: () => void;
  handleInvite: () => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedOption: number;
}

export default ApplicantInviteCard
