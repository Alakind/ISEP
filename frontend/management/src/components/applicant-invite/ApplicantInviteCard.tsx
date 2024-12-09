import {ApplicantInterface, AssessmentInterface} from "../../utils/types.tsx";
import Button from "../Button.tsx";

function ApplicantInviteCard({applicantData, assessmentsData, handleCancel, handleInvite, handleChange}: Props) {
  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={applicantData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={applicantData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Assessment:</label>
          <select
            name="preferredLanguage"
            value={applicantData.preferredLanguage.toString()}
            onChange={handleChange}
          />
          {assessmentsData.map((assessment: AssessmentInterface) => {
            return (<option key={assessment.id} value={assessment.tag}>{assessment.tag}</option>)
          })}
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
  handleChange: (e: any) => void;
}

export default ApplicantInviteCard
