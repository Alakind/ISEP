import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/dark_mode.css";
import React, {useEffect, useState} from "react";
import ReactLoading from 'react-loading';

function AssessmentPageContainer() {
  const [assessment, setAssessment] = useState({ sections: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);

  let initialAssignments: number[] = []
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<number[]>([0]);

  useEffect(() => {
    const API_URL =  "https://localhost:8081/section"; //import.meta.env.VITE_API_APPLICANT_URL +

    // Fetch data from API
    fetch(API_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAssessment({ sections: data });
            for (let i = 0; i < data.length; i++) {
                initialAssignments.push(0);
            }
          setCurrentAssignmentIndex(initialAssignments)
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(true);
        });
  }, []);

  return (
    <div className="page">
        {isLoading ? (
            <div className="page page--center">
                <ReactLoading type="spin" color="#ffffff" height={'80px'} width={'80px'} />
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
