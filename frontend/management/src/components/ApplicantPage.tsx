import { ApplicantInterface } from "../utils/types";
import "../styles/applicant-page.css"


function ApplicantPage({ applicant, goToApplicantsPage }: Props) {
  return (
    <>
      <span className="applicant-page__header">
        <button className="btn btn--mod applicant-page__header__back-btn" onClick={goToApplicantsPage}><i className="bi bi-arrow-left-square"></i>Back to all applicants</button>
      </span>
      <div className="applicant-page__container">

        This is personal page of {applicant.name}
      </div>
    </>
  );
}

interface Props {
  applicant: ApplicantInterface;
  goToApplicantsPage: () => void;
}

export default ApplicantPage;
