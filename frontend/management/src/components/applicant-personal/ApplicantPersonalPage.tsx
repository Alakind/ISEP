import {ApplicantInterface, AssessmentInterface, InviteInterface} from "../../utils/types.tsx";
import "../../styles/applicant-personal-page.css";
import Button from "../Button.tsx";
import ApplicantPersonalCardContainer from "../../containers/applicant-personal/ApplicantPersonalCardContainer.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import CardHeaderContainer from "../../containers/card/CardHeaderContainer.tsx";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";
import AssessmentResultsViewerContainer from "../../containers/applicant-personal/results/AssessmentResultsViewerContainer.tsx";
import InvitesOverviewContainer from "../../containers/applicant-personal/InvitesOverviewContainer.tsx";


function ApplicantPersonalPage({applicant, setApplicant, goToApplicantsPage, invitesData, assessmentsData}: Props): ReactNode {
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
        <InvitesOverviewContainer invitesData={invitesData} assessmentsData={assessmentsData}/>
      </CardBodyContainer>
      {
        applicant.invites && invitesData && assessmentsData ?
          <AssessmentResultsViewerContainer invitesData={invitesData} assessmentsData={assessmentsData}/> :
          <></>
      }
    </>
  );
}

interface Props {
  applicant: ApplicantInterface;
  setApplicant: Dispatch<SetStateAction<ApplicantInterface>>;
  goToApplicantsPage: () => void;
  invitesData: InviteInterface[];
  assessmentsData: AssessmentInterface[];
}

export default ApplicantPersonalPage;
