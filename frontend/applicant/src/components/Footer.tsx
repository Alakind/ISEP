import InfoSupportMailSupport from "./InfoSupportMailSupport";
import "../styles/dark_mode_footer.css";
import {AssessmentInterface} from "../utils/types.tsx";
import DismissibleMessageBlock from "./DismissibleMessageBlock.tsx"
import SectionMenu from "./SectionMenu.tsx";
import React, {useState} from "react";

function Footer({ assessment, currentSectionIndex, setCurrentSectionIndex, currentAssignmentIndex, setCurrentAssignmentIndex }: Props) {
    const [endOfAssessment, setEndOfAssessment] = useState(false);
    const handleNextAssignment = (assessment) : void  => {
        setCurrentAssignmentIndex((prevIndexes: number[]) : number[] => {
            const currentAssignment: number = prevIndexes[currentSectionIndex];
            const currentSection = assessment.sections[currentSectionIndex];

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
            } else {
                // Loop back to the first section and assignment
                setEndOfAssessment(true);
                setCurrentSectionIndex(0);
                return prevIndexes.map((_: number, mapIndex: number) : number => (mapIndex === 0 ? 0 : prevIndexes[mapIndex]));
            }
        });
    };

    return (
    <footer className="footer">
      <span className="footer__left">
        <InfoSupportMailSupport
          element={<i className="bi bi-question-circle"></i>}
        />
        <i className="bi bi-moon"></i>
      </span>
      <span className="footer__center">
        <span className="footer__center__question-menu">
            <SectionMenu assessment={assessment} currentSectionIndex={currentSectionIndex} setCurrentSectionIndex={setCurrentSectionIndex} currentAssignmentIndex={currentAssignmentIndex} setCurrentAssignmentIndex={setCurrentAssignmentIndex}/>
        </span>
      </span>
      <span className="footer__right">
        <span className="footer__right__next-question">
            <span>Next Question</span>
            <a onClick={() => handleNextAssignment(assessment)}>
                <i className="bi bi-arrow-right-circle"></i>
            </a>
        </span>
      </span>

        {/*{endOfAssessment && (*/}
        {/*    <DismissibleMessageBlock*/}
        {/*        title={"End of assessment"}*/}
        {/*        message={"TODO: You reached the end of the assessment, but there are still questions open to be filled in"}*/}
        {/*    />*/}
        {/*)}*/}
    </footer>
  );
}

interface Props {
    assessment: AssessmentInterface;
    currentSectionIndex: number;
    setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
    currentAssignmentIndex: number[];
    setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
}

export default Footer;
