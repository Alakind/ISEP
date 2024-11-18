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
    console.log(API_URL)

    // Fetch data from API
    fetch(API_URL)
        .then((response) => {
            console.log(response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAssessment({ sections: data });
          console.log("data: " + data);
            for (let i = 0; i < data.length; i++) {
                initialAssignments.push(0);
            }
          setCurrentAssignmentIndex(initialAssignments)
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("error: " + error);
          setIsLoading(true);
        });
  }, []);

  console.log("assessment: " + assessment);


  // const assessment = {
  //   sections: [
  //     {
  //       name: "Multiple-Choice 1",
  //       assignments: [
  //         {
  //           id: "randomid12345678",
  //           type: AssignmentTypes.MULTIPLE_CHOICE,
  //           isSolved: false,
  //           text: ["What is the best scouting association?"],
  //           options: [
  //             "Scouting St. Jozef Hooglanderveen | Vathorst",
  //             "Radix",
  //             "Scouting Nederland",
  //             "Studentenscouting U.F.O.-Stam!",
  //           ],
  //           isMultipleAnswers : true,
  //         },
  //         {
  //           id: "randomid4398630",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: [
  //             "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
  //           ],
  //         },
  //         {
  //           id: "randomid43982345674534630",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: [
  //             "Make a story about teletubbie of 5000 words.",
  //           ],
  //         },
  //         {
  //           id: "randomid439234234674534630",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: [
  //             "Make a story about time of 5000 words.",
  //           ],
  //         },
  //         {
  //           id: "randomid43982345234234630",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: [
  //             "Make a story about bricks of 5000 words.",
  //           ],
  //         },
  //         {
  //           id: "randomid43982343242345674534630",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: [
  //             "Make a story about quantum mechanics of 5000 words.",
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "Multiple-Choice 2",
  //       assignments: [
  //         {
  //           id: "randomid12345",
  //           type: AssignmentTypes.MULTIPLE_CHOICE,
  //           isSolved: false,
  //           text: ["What is the square root of -1?"],
  //           options: ["1", "0", "imagine it would have a number"],
  //           isMultipleAnswers: false,
  //         },
  //         {
  //           id: "randomid42069",
  //           type: AssignmentTypes.OPEN,
  //           isSolved: false,
  //           text: ["Proof the mathetical problem about P versus NP in 2 pages"],
  //         },
  //       ],
  //     },
  //     {
  //       name: "Java",
  //       assignments: [
  //         {
  //           id: "codingAss1",
  //           type: AssignmentTypes.CODING,
  //           isSolved: false,
  //           text: "What is the following called?",
  //           image: "",
  //         },
  //         {
  //           id: "codingAss2",
  //           type: AssignmentTypes.CODING,
  //           isSolved: false,
  //           text: "Extend the following code?",
  //           image: "",
  //         }
  //       ],
  //     },
  //   ],
  // };



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
