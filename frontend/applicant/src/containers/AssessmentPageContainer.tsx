import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/general.css";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

function AssessmentPageContainer() {
  const [assessment, setAssessment] = useState<{ sections: object[] }>({
    sections: [],
  });
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<
    number[]
  >([0]);

  useEffect(() => {
    const inviteId = localStorage.getItem("inviteId");
    if (!inviteId) {
      throw new Error("Couldn't get invite Id.");
    }

    const API_SECTIONS_URL =
      import.meta.env.VITE_API_APPLICANT_URL +
      "/invite/" +
      inviteId +
      "/assessment";

    const fetchData = async () => {
      try {
        const response = await fetch(API_SECTIONS_URL);

        if (!response.ok) {
          throw new Error(
            "Couldn't connect to the server, please try again or email InfoSupport!"
          );
        }

        const data = await response.json();
        setSections(data.sections);

        const sectionsFetched = [];
        const assignmentsFetched = [];
        for (let i = 0; i < data.sections.length; i++) {
          const API_SECTION_URL =
            import.meta.env.VITE_API_APPLICANT_URL +
            "/section/" +
            data.sections[i] +
            "/solution/" +
            inviteId;

          const responseSection = await fetch(API_SECTION_URL);
          if (!response.ok) {
            throw new Error(
              "Couldn't connect to the server, please try again or email InfoSupport!"
            );
          }
          const section = await responseSection.json();
          //   console.log(section);
          sectionsFetched.push({
            assignments: section.assignments,
            title: section.title,
          });
          assignmentsFetched.push(0);
        }

        // TODO: remove the stub
        setAssessment({ sections: sectionsFetched });
        // setCurrentAssignmentIndex(assignmentsFetched);
        // console.log({ sections: sectionsFetched });
        const initialAssignments = Array(sectionsFetched.length).fill(0);
        setCurrentAssignmentIndex(initialAssignments);

        setIsLoading(false);
      } catch (error) {
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
