import {AssessmentInterface} from "../utils/types";
import "../styles/header.css";
import {useEffect, useState} from "react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {formatTime, getTime} from "../utils/operations.tsx";

function Header({assessment, currentSectionIndex, secondsLeft}: Readonly<Props>) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (secondsLeft > 0) {
      const {hours, minutes, seconds} = getTime(secondsLeft);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    } else {
      toast.info("Assessment has been finished")
      navigate("/finish")
    }
  }, [navigate, secondsLeft]);

  return (
    <header className="header">
      <span className="header__left">
        <div>
          Section {currentSectionIndex + 1} of {assessment.sections.length}:
        </div>
        <div>
          {assessment.sections[currentSectionIndex].title} Questions
        </div>
      </span>
      <span className="header__center">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </span>
      <span className="header__right">
        <span>
          <span>Time left: </span>
          <span
            className="header__time-text">{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</span>
        </span>
        <span>
          <i className="bi bi-clock"></i>
        </span>
      </span>
    </header>
  );
}

interface Props {
  assessment: AssessmentInterface;
  currentSectionIndex: number;
  secondsLeft: number;
}

export default Header;
