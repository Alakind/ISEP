import Button from "../Button.tsx";
import "../../styles/applicant-invite-card.css"
import ApplicantInviteCardContainer from "../../containers/applicant-invite/ApplicantInviteCardContainer.tsx";
import {ReactNode} from "react";

function ApplicantInvite({goToApplicantsPage} : Props): ReactNode {
  return (
    <div className="applicant-add">
      <span className="applicant-page__header">
        <Button
          handleClick={goToApplicantsPage}
          btnClasses={"applicant-invite__header__back-btn"}
          iconClass={"bi-arrow-left-short"}
          spanTextClass={"applicant-invite__header__btn__text"}
          text={"Back to all applicants"}
        />
      </span>
      <div className="applicant-invite__container">
        <ApplicantInviteCardContainer/>
      </div>
    </div>
  )
}

interface Props {
  goToApplicantsPage: () => void;
}

export default ApplicantInvite