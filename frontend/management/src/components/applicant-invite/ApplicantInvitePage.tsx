import Button from "../Button.tsx";
import ApplicantInviteCardContainer from "../../containers/applicant-invite/ApplicantInviteCardContainer.tsx";
import {ReactNode} from "react";
import CardHeaderContainer from "../../containers/card/CardHeaderContainer.tsx";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";

function ApplicantInvitePage({goToApplicantsPage}: Readonly<Props>): ReactNode {
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
        <ApplicantInviteCardContainer/>
      </CardBodyContainer>
    </>
  )
}

interface Props {
  goToApplicantsPage: () => void;
}

export default ApplicantInvitePage