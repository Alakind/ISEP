import {ApplicantInterface} from "../../utils/types.tsx";
import "../../styles/applicant-personal-page.css"
import {ApplicantStatuses} from "../../utils/constants.tsx";
import {mapStatus} from "../../utils/mapping.tsx";
import AssessmentResultsViewerContainer from "../../containers/applicant-personal/AssessmentResultsViewerContainer.tsx";
import Button from "../Button.tsx";
import ApplicantPersonalCardContainer from "../../containers/applicant-personal/ApplicantPersonalCardContainer.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import CardHeaderContainer from "../../containers/card/CardHeaderContainer.tsx";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import StatusOverview from "./StatusOverview.tsx";


function ApplicantPersonalPage({applicant, setApplicant, goToApplicantsPage, assessmentId}: Props): ReactNode {
  return (
    <>
      <CardHeaderContainer>
        <Button
          handleClick={goToApplicantsPage}
          iconClass={"bi-arrow-left-short"}
          spanTextClass={"card-page__header__btn__text"}
          text={"Back to all applicants"}
        />
      </CardHeaderContainer>
      <CardBodyContainer>
        <ApplicantPersonalCardContainer applicant={applicant} setApplicant={setApplicant}/>
        <StatusOverview applicant={applicant}/>
      </CardBodyContainer>
      {mapStatus(applicant.status) == (ApplicantStatuses.APP_FINISHED || ApplicantStatuses.INTERVIEW_FINISHED || ApplicantStatuses.INTERVIEW_INVITED) && applicant.invite ?
        <AssessmentResultsViewerContainer assessmentId={assessmentId} inviteUuid={applicant.invite}/> :
        <></>
      }
    </>
  );
}

interface Props {
  applicant: ApplicantInterface;
  setApplicant: Dispatch<SetStateAction<ApplicantInterface>>;
  goToApplicantsPage: () => void
  assessmentId: string;
}

export default ApplicantPersonalPage;
