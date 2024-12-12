import Button from "../Button.tsx";
import ApplicantAddCardContainer from "../../containers/applicant-add/ApplicantAddCardContainer.tsx";
import {ReactNode} from "react";
import CardHeaderContainer from "../../containers/card/CardHeaderContainer.tsx";
import CardBodyContainer from "../../containers/card/CardBodyContainer.tsx";

function ApplicantAddPage({goToApplicantsPage}: Props): ReactNode {
  return (
    <>
      <CardHeaderContainer>
        <Button
          handleClick={goToApplicantsPage}
          iconClass={"bi-arrow-left-short"}
          btnClasses={"card-page__btn"}
          spanTextClass={"card-page__header__btn__text"}
          text={"Back to all applicants"}
        />
      </CardHeaderContainer>
      <CardBodyContainer>
        <ApplicantAddCardContainer/>
      </CardBodyContainer>
    </>
  )
}

interface Props {
  goToApplicantsPage: () => void;
}

export default ApplicantAddPage
