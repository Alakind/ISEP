import { ApplicantInterface } from "../../utils/types.tsx";
import "../../styles/applicant-page.css"
import StatusItem from "../StatusItem.tsx";
import {ApplicantStatuses} from "../../utils/constants.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import AssessmentResultsViewerContainer from "../../containers/AssessmentResultsViewerContainer.tsx";
import Button from "../Button.tsx";
import ApplicantCardContainer from "../../containers/applicant-personal/ApplicantCardContainer.tsx";
import React from "react";


function ApplicantPage({ applicant, setApplicant, goToApplicantsPage }: Props) {
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
      {mapStatus(applicant.status) == (ApplicantStatuses.APP_FINISHED || ApplicantStatuses.INTERVIEW_FINISHED || ApplicantStatuses.INTERVIEW_INVITED) ?
        <div className="applicant-page__results">
          <AssessmentResultsViewerContainer/>
        </div> :
        <></>
      }

    </div>
  );
}

interface Props {
  applicant: ApplicantInterface;
  setApplicant: React.Dispatch<React.SetStateAction<ApplicantInterface>>;
  goToApplicantsPage: () => void;
}

export default ApplicantPage;
