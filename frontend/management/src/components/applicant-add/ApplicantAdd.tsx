import Button from "../Button.tsx";
import ApplicantAddCardContainer from "../../containers/applicant-add/ApplicantAddCardContainer.tsx";
import "../../styles/applicant-add-card.css"

function ApplicantAdd({goToApplicantsPage} : Props) {
  return (
    <div className="applicant-add">
      <span className="applicant-page__header">
        <Button
          handleClick={goToApplicantsPage}
          btnClasses={"applicant-add__header__back-btn"}
          iconClass={"bi-arrow-left-short"}
          spanTextClass={"applicant-add__header__btn__text"}
          text={"Back to all applicants"}
        />
      </span>
      <div className="applicant-add__container">
        <ApplicantAddCardContainer/>
      </div>
    </div>
  )
}

interface Props {
  goToApplicantsPage: () => void;
}

export default ApplicantAdd
