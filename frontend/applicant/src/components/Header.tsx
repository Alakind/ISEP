import { AssessmentInterface } from "../utils/types";
import "../styles/header.css";
import React from "react";
import {ToastContainer} from "react-toastify";

function Header({ assessment, currentSectionIndex }: Props) {
  return (
    <header className="header">
      <span className="header__left">
        <div>
          Section {currentSectionIndex + 1} of {assessment.sections.length}:
        </div>
        <div>
          {/* TODO make section types a variable */}
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
            transition: Bounce
          />
      </span>
      <span className="header__right">
        <span>
          <span>Time left: </span>
          <span className="header__time-text">00:12:34</span>
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
}

export default Header;
