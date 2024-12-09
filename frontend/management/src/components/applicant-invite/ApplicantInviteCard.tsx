import {ApplicantInterface, AssessmentInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";

function ApplicantInviteCard({applicantData, assessmentsData, handleCancel, handleInvite, handleSelect, selectedOption}: Props) {
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
            onChange={(e) => handleSelect(e)}
            defaultValue={assessmentsData[selectedOption]?.tag ?? 0}
          >
            {assessmentsData.map((assessment: AssessmentInterface) => {
              return (<option key={assessment.id} id={assessment.id} value={assessment.id}>{assessment.tag}</option>)
            })}
          </select>
        </div>
      </form>
      <div className="applicant-add__btns">
        <Button handleClick={handleCancel} iconClass={"bi-x"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Cancel"} activeTooltip={true}/>
        <Button handleClick={handleInvite} iconClass={"bi-person-lines-fill"} btnClasses={"applicant-add__btn"} spanTextClass={"applicant-add__btn__text"} text={"Add & Invite"} activeTooltip={true}/>
      </div>
    </div>
  )
}

interface Props {
  applicantData: ApplicantInterface;
  assessmentsData: AssessmentInterface[];
  handleCancel: () => void;
  handleInvite: () => void;
  handleSelect: (e: any) => void;
  selectedOption: number;
}

export default ApplicantInviteCard
