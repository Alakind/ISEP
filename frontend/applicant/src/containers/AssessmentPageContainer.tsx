import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/general.css";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { SectionInterface } from "../utils/types.tsx";
import { fetchAssessment } from "../utils/apiFunctions.tsx";

function AssessmentPageContainer() {
  const [assessment, setAssessment] = useState<{
    sections: SectionInterface[];
  }>({
    sections: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function setAssignmentAnswer(
    sectionIndex: number,
    assignmentIndex: number,
    newAnswer: object
  ) {
    setAssessment((oldAssessment: { sections: SectionInterface[] }) => {
      const oldAnswer =
        oldAssessment.sections[sectionIndex].assignments[assignmentIndex]
          .answer;

      oldAssessment.sections[sectionIndex].assignments[assignmentIndex].answer =
        { ...oldAnswer, ...newAnswer };

      return oldAssessment;
    });
  }

  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<
    number[]
  >([0]);

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
        }
        if (
          error instanceof TypeError &&
          error.message.includes("Failed to fetch")
        ) {
          setErrorMessage(
            "Connection error: The server seems not to be running, please contact InfoSupport!"
          );
        } else {
          setErrorMessage(error.message || "An unknown error occurred.");
        }

        setIsLoading(true);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page">
      {isLoading ? (
        <div className="page page--center">
          <ReactLoading
            type="spin"
            color="var(--text-primary)"
            height={"80px"}
            width={"80px"}
          />
          <br></br>
          <p>{errorMessage != "" ? errorMessage.toString() : "Loading..."}</p>
        </div>
      ) : (
        <>
          <Header
            assessment={assessment}
            currentSectionIndex={currentSectionIndex}
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
            setCurrentSectionIndex={setCurrentSectionIndex}
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
