import InfoSupportLogo from "../components/InfoSupportLogo";
import InfoSupportMailSupport from "../components/InfoSupportMailSupport";
import "../styles/general.css";
import "../styles/welcome.css";
import {formatTime, getTime} from "../utils/operations.tsx";

function WelcomePage({handleStart, inviteId, name, availableSeconds}: Readonly<Props>) {
  const {hours, minutes, seconds} = getTime(availableSeconds);
  return (
    <div className="welcomePage">
      <div className="logoContainer">
        <InfoSupportLogo/>
      </div>
      <h2>Welcome{name !== "" ? `, ${name}` : ""}!</h2>
      <div className="infoTextContainer">
        <p>
          to InfoSupport<sup>&reg;</sup> assessment. In this assessment you will
          answer multiple-choice and coding questions. You will have a maximum
          time of {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)} to complete these. Once you are ready to begin, press
          the 'Start' button.
        </p>
        <p>
          In case of any problems, please contact{" "}
          <InfoSupportMailSupport element={"InfoSupport"} inviteId={inviteId} name={name}/>. <br></br>During
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
  inviteId: string | null;
  name: string;
  availableSeconds: number;
}

export default WelcomePage;
