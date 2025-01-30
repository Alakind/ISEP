import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/general.css";
import {useEffect, useState} from "react";
import {AssignmentCodingInterface, AssignmentMultipleChoiceInterface, AssignmentOpenInterface, SectionInterface} from "../utils/types.tsx";
import {fetchAssessment, finishAssessment, getSecondsLeft, switchSection,} from "../utils/apiFunctions.tsx";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../components/LoadingPage.tsx";
import {AssignmentTypes} from "../utils/constants.tsx";

function AssessmentPageContainer() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<{ sections: SectionInterface[]; availableSeconds: number; }>({sections: [], availableSeconds: 7200});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<number[]>([0]);

  useEffect(() => {
    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    const fetchData = async () => {
      try {
        const assessmentFetched = await fetchAssessment(inviteId);

        setAssessment(assessmentFetched);

        const initialAssignments = Array(
          assessmentFetched.sections.length
        ).fill(0);
        setCurrentAssignmentIndex(initialAssignments);

        setIsLoading(false);
      } catch (error) {
        if (!(error instanceof Error)) {
          return;
        } else if (error.message.includes("Failed to fetch")) {
          setErrorMessage("Connection error: The server seems not to be running, please contact InfoSupport!");
        } else {
          setErrorMessage(error.message || "An unknown error occurred.");
        }

        setIsLoading(true);
      }
    };

    fetchData().then();
  }, []);

  async function changeSectionIndex(sectionIndex: number): Promise<void> {
    setCurrentSectionIndex(sectionIndex);
    const sectionId = assessment.sections[sectionIndex].id;

    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    await switchSection(inviteId, sectionId);
  }

  const [secondsLeft, setSecondsLeft] = useState(assessment.availableSeconds);

  useEffect(() => {
    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    setTimeout(async () => {
      const secondsLeft = await getSecondsLeft(inviteId);
      setSecondsLeft(secondsLeft);
    }, 0);

    const syncIntervalId = setInterval(async () => {
      const secondsLeft = await getSecondsLeft(inviteId);
      setSecondsLeft(secondsLeft);

      if (secondsLeft <= 0) {
        await finishAssessment(inviteId);
        navigate("/assessment");
      }
    }, 10000);

    const timerIntervalId = setInterval(async () => {
      setSecondsLeft((secondsLeftOld) => {
        return Math.max(secondsLeftOld - 1, 0);
      });
    }, 1000);

    return () => {
      clearInterval(syncIntervalId);
      clearInterval(timerIntervalId);
    };
  }, []);

  function setAssignmentAnswer(sectionIndex: number, assignmentIndex: number, newAnswer: object) {
    setAssessment((oldAssessment: { sections: SectionInterface[]; availableSeconds: number }) => {
      const assignment = oldAssessment.sections[sectionIndex].assignments[assignmentIndex];
      if (assignment.type === AssignmentTypes.MULTIPLE_CHOICE) {
        const oldAnswer = (assignment as AssignmentMultipleChoiceInterface).answer;
        (assignment as AssignmentMultipleChoiceInterface).answer = {...oldAnswer, ...newAnswer};
      } else if (assignment.type === AssignmentTypes.OPEN) {
        const oldAnswer = (assignment as AssignmentOpenInterface).answer;
        (assignment as AssignmentOpenInterface).answer = {...oldAnswer, ...newAnswer};
      } else if (assignment.type === AssignmentTypes.CODING) {
        const oldAnswer = (assignment as AssignmentCodingInterface).answer;
        (assignment as AssignmentCodingInterface).answer = {...oldAnswer, ...newAnswer};
      }

      return oldAssessment;
    });
  }

  return (
    <div className="page">
      {isLoading ? (
        <LoadingPage errorMessage={errorMessage} showMessage={true}/>
      ) : (
        <>
          <Header
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
            secondsLeft={secondsLeft}
          />
          <Main
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
            currentAssignmentIndex={currentAssignmentIndex}
            setAssignmentAnswer={setAssignmentAnswer}
          />
          <Footer
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
            changeSectionIndex={changeSectionIndex}
            currentAssignmentIndex={currentAssignmentIndex}
            setCurrentAssignmentIndex={setCurrentAssignmentIndex}
            endOfAssessment={endOfAssessment}
            setEndOfAssessment={setEndOfAssessment}
          />
        </>
      )}
    </div>
  );
}

export default AssessmentPageContainer;
