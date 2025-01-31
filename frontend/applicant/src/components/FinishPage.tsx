import InfoSupportLogo from "./InfoSupportLogo.tsx";

function FinishPage({name,}: Readonly<Props>) {
  return (
    <div className="page page--center">
      <div className="logoContainer">
        <InfoSupportLogo/>
      </div>
      <h2>Thank you{name !== "" ? `, ${name}` : ""}!</h2>
      <div className="infoTextContainer">
        <p>
          for taking the InfoSupport<sup>&reg;</sup> assessment. You will be contacted by
          an InfoSupport employee when they have looked at your assessment and want to plan
          a meeting to discuss the results.
        </p>
        <p>
          In case of any other question, please contact <a href="mailto:recruiter@infosupport.nl">InfoSupport</a>.
        </p>
      </div>
    </div>
  )
}

interface Props {
  name: string | null;
}

export default FinishPage
