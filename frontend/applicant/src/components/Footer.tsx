import InfoSupportMailSupport from "./InfoSupportMailSupport";
import "../styles/footer.css";
import {AssessmentInterface} from "../utils/types.tsx";
import SectionMenu from "./SectionMenu.tsx";
import React, {useEffect} from "react";
import {toast} from "react-toastify";
import ThemeSwitch from "./ThemeSwitch.tsx";

function Footer({ assessment, currentSectionIndex, setCurrentSectionIndex, currentAssignmentIndex, setCurrentAssignmentIndex, endOfAssessment, setEndOfAssessment}: Props) {

    useEffect(() => {
        if (endOfAssessment) {
            toast("You reached the end of the assessment, but there are still questions open to be filled in: ...");
            setEndOfAssessment(false);
        }
    }, [endOfAssessment]);

    const handleNextAssignment = () : void  => {
        setCurrentAssignmentIndex((prevIndexes: number[]) : number[] => {
            const currentAssignment: number = prevIndexes[currentSectionIndex];
            const currentSection = assessment.sections[currentSectionIndex];

            //TODO save the state of the question(s)
            if (currentAssignment < currentSection.assignments.length - 1) {
                // Move to the next assignment within the current section
                return prevIndexes.map((index: number, mapIndex: number) : number =>
                    mapIndex === currentSectionIndex ? currentAssignment + 1 : index
                );
            } else if (currentSectionIndex < assessment.sections.length - 1) {
                // Move to the first assignment of the next section
                setCurrentSectionIndex(currentSectionIndex + 1);
                return prevIndexes.map((index: number, mapIndex: number) : number =>
                    mapIndex === currentSectionIndex + 1 ? 0 : index
                );
            } else if (currentSectionIndex + 1 >= assessment.sections.length - 1) {
                // Loop back to the first section and assignment
                setEndOfAssessment(true);
                setCurrentSectionIndex(0);
                return prevIndexes.map((_: number, mapIndex: number) : number => (mapIndex === 0 ? 0 : prevIndexes[mapIndex]));
            }
        });
    };

    const handleFinishAssessment = () : void => {
        setEndOfAssessment(true);
        //TODO check all states in the backend
        //TODO popup a message with missing assignment submissions
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
            <SectionMenu assessment={assessment} currentSectionIndex={currentSectionIndex} setCurrentSectionIndex={setCurrentSectionIndex} currentAssignmentIndex={currentAssignmentIndex} setCurrentAssignmentIndex={setCurrentAssignmentIndex}/>
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
            <a onClick={() => handleFinishAssessment()}>
                <span>Finish</span>
                <i className="bi bi-flag"></i>
            </a>
        </span>
      </span>
    </footer>
  );
}

interface Props {
    assessment: AssessmentInterface;
    currentSectionIndex: number;
    setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
    currentAssignmentIndex: number[];
    setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
    endOfAssessment: boolean;
    setEndOfAssessment: React.Dispatch<React.SetStateAction<boolean>>;
}

export default Footer;
