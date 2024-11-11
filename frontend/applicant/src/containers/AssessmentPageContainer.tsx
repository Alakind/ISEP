import Header from "../components/Header.tsx";
import Main from "../components/Main.tsx";
import Footer from "../components/Footer.tsx";
import { AssignmentTypes } from "../utils/constants";
import "../styles/dark_mode.css";

function AssessmentPageContainer() {
  const assessment = {
    sections: [
      {
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
        ],
      },
      {
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
    ],
  };
  return (
    <div className="page">
      <Header assessment={assessment} />

      <Main assessment={assessment} />

      <Footer />
    </div>
  );
}

export default AssessmentPageContainer;
