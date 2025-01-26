import InfoSupportMailSupport from "./InfoSupportMailSupport";
import "../styles/footer.css";
import { AssessmentInterface } from "../utils/types.tsx";
import SectionMenu from "./SectionMenu.tsx";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ThemeSwitch from "./ThemeSwitch.tsx";
import { finishAssessment } from "../utils/apiFunctions.tsx";
import { useNavigate } from "react-router-dom";

function Footer({
  assessment,
  currentSectionIndex,
  setCurrentSectionIndex,
  currentAssignmentIndex,
  setCurrentAssignmentIndex,
  endOfAssessment,
  setEndOfAssessment,
}: Props) {
  const [isFinishModalVisible, setIsFinishModalVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();

  async function handleFinish() {
    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    await finishAssessment(inviteId);
    navigate("/finish");
  }

  useEffect(() => {
    if (endOfAssessment) {
      toast(
        "You reached the end of the assessment, but there are still questions open to be filled in: ..."
      );
      setEndOfAssessment(false);
    }
  }, [endOfAssessment]);

  const handleNextAssignment = (): void => {
    setCurrentAssignmentIndex((prevIndexes: number[]): number[] => {
      const currentAssignment: number = prevIndexes[currentSectionIndex];
      const currentSection = assessment.sections[currentSectionIndex];

      //TODO save the state of the question(s)
      if (currentAssignment < currentSection.assignments.length - 1) {
        // Move to the next assignment within the current section
        return prevIndexes.map((index: number, mapIndex: number): number =>
          mapIndex === currentSectionIndex ? currentAssignment + 1 : index
        );
      } else if (currentSectionIndex < assessment.sections.length - 1) {
        // Move to the first assignment of the next section
        setCurrentSectionIndex(currentSectionIndex + 1);
        return prevIndexes.map((index: number, mapIndex: number): number =>
          mapIndex === currentSectionIndex + 1 ? 0 : index
        );
      } else if (currentSectionIndex + 1 >= assessment.sections.length - 1) {
        // Loop back to the first section and assignment
        setEndOfAssessment(true);
        setCurrentSectionIndex(0);
        return prevIndexes.map((_: number, mapIndex: number): number =>
          mapIndex === 0 ? 0 : prevIndexes[mapIndex]
        );
      }
    });
  };

  return (
    <footer className="footer">
      <span className="footer__left">
        <InfoSupportMailSupport
          element={<i className="bi bi-question-circle"></i>}
        />
        <ThemeSwitch />
      </span>
      <span className="footer__center">
        <span className="footer__center__question-menu">
          <SectionMenu
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            currentAssignmentIndex={currentAssignmentIndex}
            setCurrentAssignmentIndex={setCurrentAssignmentIndex}
          />
        </span>
      </span>
      <span className="footer__right">
        <span className="footer__right__next-question">
          <a onClick={() => handleNextAssignment()}>
            <span>Next Question</span>
            <i className="bi bi-arrow-right-circle"></i>
          </a>
        </span>
        <span className="footer__right__finish-assessment">
          <a>
            <span onClick={() => setIsFinishModalVisible(true)}>Finish</span>
            {/* TODO: Add modal window */}
            {isFinishModalVisible && (
              <div>
                Are you sure you want to finish the assessment?
                <div>
                  <button onClick={handleFinish}>Yes</button>
                  <button onClick={() => setIsFinishModalVisible(false)}>
                    No
                  </button>
                </div>
              </div>
            )}
            <i
              className="bi bi-flag"
              onClick={() => setIsFinishModalVisible(true)}
            ></i>
          </a>
        </span>
      </span>
    </footer>
  );
}

interface Props {
  assessment: AssessmentInterface;
  currentSectionIndex: number;
  setCurrentSectionIndex: (arg: number) => void;
  currentAssignmentIndex: number[];
  setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
  endOfAssessment: boolean;
  setEndOfAssessment: React.Dispatch<React.SetStateAction<boolean>>;
}

export default Footer;
