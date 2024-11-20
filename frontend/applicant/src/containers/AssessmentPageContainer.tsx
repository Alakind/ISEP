import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/general.css";
import React, {useEffect, useState} from "react";
import ReactLoading from 'react-loading';

function AssessmentPageContainer() {
  const [assessment, setAssessment] = useState({ sections: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  let initialAssignments: number[] = []
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<number[]>([0]);

  useEffect(() => {
      const API_URL =  "https://localhost:8081/section"; //import.meta.env.VITE_API_APPLICANT_URL +

      const fetchData = async () => {
          try {
              const response = await fetch(API_URL);

              if (!response.ok) {
                  throw new Error(
                      "Couldn't connect to the server, please try again or email InfoSupport!"
                  );
              }

              const data = await response.json();
              setAssessment({ sections: data });

              const initialAssignments = Array(data.length).fill(0);
              setCurrentAssignmentIndex(initialAssignments);

              setIsLoading(false);
          } catch (error) {
              if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
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
                <ReactLoading type="spin" color='var(--text-primary)' height={'80px'} width={'80px'} />
                <br></br>
                <p>
                {errorMessage != "" ? errorMessage.toString() : "Loading..."}
                </p>
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
