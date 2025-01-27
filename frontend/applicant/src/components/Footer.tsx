import InfoSupportMailSupport from "./InfoSupportMailSupport";
import "../styles/footer.css";
import {AssessmentInterface} from "../utils/types.tsx";
import SectionMenu from "./SectionMenu.tsx";
import {Dispatch, SetStateAction, useEffect} from "react";
import {toast} from "react-toastify";
import ThemeSwitch from "./ThemeSwitch.tsx";
import {finishAssessment} from "../utils/apiFunctions.tsx";
import {useNavigate} from "react-router-dom";
import CustomWarnToast from "./CustomWarnToast.tsx";

function Footer({
                  assessment,
                  currentSectionIndex,
                  changeSectionIndex,
                  currentAssignmentIndex,
                  setCurrentAssignmentIndex,
                  endOfAssessment,
                  setEndOfAssessment,
                }: Readonly<Props>) {

  const navigate = useNavigate();

  async function handleFinish() {
    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    await finishAssessment(inviteId);
    navigate("/finish");
  }

  async function handleCancelFinish() {
    toast.info("Cancelled closing the assessment.");
    setEndOfAssessment(false);
  }

  useEffect(() => {
    if (endOfAssessment) {
      toast.warn(<CustomWarnToast proceedAction={handleFinish} cancelAction={handleCancelFinish} message={"Are you sure you want to finish the assessment?"}/>);
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
        changeSectionIndex(currentSectionIndex + 1).then();
        return prevIndexes.map((index: number, mapIndex: number): number =>
          mapIndex === currentSectionIndex + 1 ? 0 : index
        );
      } else if (currentSectionIndex + 1 >= assessment.sections.length - 1) {
        // Loop back to the first section and assignment
        setEndOfAssessment(true);
        changeSectionIndex(0).then();
        return prevIndexes.map((_: number, mapIndex: number): number =>
          mapIndex === 0 ? 0 : prevIndexes[mapIndex]
        );
      } else {
        return prevIndexes
      }
    });
  };

  return (
    <footer className="footer">
      <span className="footer__left">
        <InfoSupportMailSupport
          element={<i className="bi bi-question-circle"></i>}
          inviteId={localStorage.getItem("inviteId")}
          name={localStorage.getItem("name")}
        />
        <ThemeSwitch/>
      </span>
      <span className="footer__center">
        <span className="footer__center__question-menu">
          <SectionMenu
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
            changeSectionIndex={changeSectionIndex}
            currentAssignmentIndex={currentAssignmentIndex}
            setCurrentAssignmentIndex={setCurrentAssignmentIndex}
          />
        </span>
      </span>
      <span className="footer__right">
        <span className="footer__right__next-question">
          <button className={"btn--transparent"} onClick={() => handleNextAssignment()}>
            <span>Next Question</span>
            <i className="bi bi-arrow-right-circle"></i>
          </button>
        </span>
        <span className="footer__right__finish-assessment">
          <button className={"btn--transparent"} onClick={() => setEndOfAssessment(!endOfAssessment)}>
            <span>Finish</span>
            <i className="bi bi-flag"></i>
          </button>
        </span>
      </span>
    </footer>
  );
}

interface Props {
  assessment: AssessmentInterface;
  currentSectionIndex: number;
  changeSectionIndex: (sectionIndex: number) => Promise<void>;
  currentAssignmentIndex: number[];
  setCurrentAssignmentIndex: Dispatch<SetStateAction<number[]>>;
  endOfAssessment: boolean;
  setEndOfAssessment: Dispatch<SetStateAction<boolean>>;
}

export default Footer;
