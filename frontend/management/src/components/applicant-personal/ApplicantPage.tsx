import { ApplicantInterface } from "../../utils/types.tsx";
import "../../styles/applicant-page.css"
import StatusItem from "../StatusItem.tsx";
import {ApplicantStatuses} from "../../utils/constants.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import AssessmentResultsViewerContainer from "../../containers/applicant-personal/AssessmentResultsViewerContainer.tsx";
import Button from "../Button.tsx";
import ApplicantCardContainer from "../../containers/applicant-personal/ApplicantCardContainer.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";


function ApplicantPage({ applicant, setApplicant, goToApplicantsPage, assessmentId }: Props): ReactNode {
  return (
    <div className="applicant-page">
      <span className="applicant-page__header">
        <Button
          handleClick={goToApplicantsPage}
          btnClasses={"applicant-page__header__back-btn"}
          iconClass={"bi-arrow-left-short"}
          spanTextClass={"applicant-page__header__btn__text"}
          text={"Back to all applicants"}
        />
      </span>
      <div className="applicant-page__container">
        <span className="applicant-page__container__info">
          <ApplicantCardContainer applicant={applicant} setApplicant={setApplicant} />
        </span>
        <span className="applicant-page__container__status-overview">
          <h4>Status</h4>
          <StatusItem status={mapStatus(applicant.status)}/>
        </span>
      </div>
      {mapStatus(applicant.status) == (ApplicantStatuses.APP_FINISHED || ApplicantStatuses.INTERVIEW_FINISHED || ApplicantStatuses.INTERVIEW_INVITED) && applicant.invite ?
        <div className="applicant-page__results">
          <AssessmentResultsViewerContainer assessmentId={assessmentId} inviteUuid={applicant.invite}/>
        </div> :
        <></>
      }
    </div>
  );
}

interface Props {
  applicant: ApplicantInterface;
  setApplicant: Dispatch<SetStateAction<ApplicantInterface>>;
  goToApplicantsPage: () => void
  assessmentId: string;
}

export default ApplicantPage;
