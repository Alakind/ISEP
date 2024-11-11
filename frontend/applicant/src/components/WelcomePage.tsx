import InfoSupportLogo from "../components/infoSupportLogo";
import InfoSupportMailSupport from "../components/InfoSupportMailSupport";
import "../styles/dark_mode.css";
import "../styles/dark_mode_welcome.css";

function WelcomePage({ handleStart }: Props) {
  return (
    <div className="welcomePage">
      {/* TODO put name of user here. */}
      <div className="logoContainer">
        <InfoSupportLogo />
      </div>
      <h2>Welcome, Claire!</h2>
      <div className="infoTextContainer">
        <p>
          to InfoSupport<sup>&reg;</sup> assessment. In this
          assessment you will answer multiple-choice and coding questions.
          You will have a maximum time of 02:00:00 to complete these. Once you
          are ready to begin, press the 'Start' button.
        </p>
        <p>
          In case of any problems, please contact{" "}
          <InfoSupportMailSupport element={"InfoSupport"} />. <br></br>During
          the questionnaire, you can press the ? button to request support.
        </p>
      </div>

      <button className="btn btn-primary btn-lg btn--mod" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

interface Props {
  handleStart: () => void;
}

export default WelcomePage;
