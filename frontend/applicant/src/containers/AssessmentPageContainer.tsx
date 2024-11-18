import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import { AssignmentTypes } from "../utils/constants";
import "../styles/dark_mode.css";
import {useState} from "react";

function AssessmentPageContainer() {
  const assessment = {
    sections: [
      {
        name: "Multiple-Choice 1",
        assignments: [
          {
            id: "randomid12345678",
            type: AssignmentTypes.MULTIPLE_CHOICE,
            isSolved: false,
            text: ["What is the best scouting association?"],
            options: [
              "Scouting St. Jozef Hooglanderveen | Vathorst",
              "Radix",
              "Scouting Nederland",
              "Studentenscouting U.F.O.-Stam!",
            ],
            isMultipleAnswers : true,
          },
          {
            id: "randomid4398630",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: [
              "Write a 3000 words essay about Pepin the Short's conquests of the Rousillon.",
            ],
          },
          {
            id: "randomid43982345674534630",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: [
              "Make a story about teletubbie of 5000 words.",
            ],
          },
          {
            id: "randomid439234234674534630",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: [
              "Make a story about time of 5000 words.",
            ],
          },
          {
            id: "randomid43982345234234630",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: [
              "Make a story about bricks of 5000 words.",
            ],
          },
          {
            id: "randomid43982343242345674534630",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: [
              "Make a story about quantum mechanics of 5000 words.",
            ],
          },
        ],
      },
      {
        name: "Multiple-Choice 2",
        assignments: [
          {
            id: "randomid12345",
            type: AssignmentTypes.MULTIPLE_CHOICE,
            isSolved: false,
            text: ["What is the square root of -1?"],
            options: ["1", "0", "imagine it would have a number"],
            isMultipleAnswers: false,
          },
          {
            id: "randomid42069",
            type: AssignmentTypes.OPEN,
            isSolved: false,
            text: ["Proof the mathetical problem about P versus NP in 2 pages"],
          },
        ],
      },
      {
        name: "Java",
        assignments: [
          {
            id: "codingAss1",
            type: AssignmentTypes.CODING,
            isSolved: false,
            text: "What is the following called?",
            image: "",
          },
          {
            id: "codingAss2",
            type: AssignmentTypes.CODING,
            isSolved: false,
            text: "Extend the following code?",
            image: "",
          }
        ],
      },
    ],
  };
  let initialAssignments: number[] = []
  for (let i = 0; i < assessment.sections.length; i++) {
    initialAssignments.push(0);
  }

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState<number[]>(initialAssignments);
  const [endOfAssessment, setEndOfAssessment] = useState<boolean>(false);

  return (
    <div className="page">
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
    </div>
  );
}

export default AssessmentPageContainer;
