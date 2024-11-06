import Assignment from "../components/Assignment";
import InterviewHeader from "../components/InterviewHeader";
import InterviewMain from "../components/InterviewMain";
import InterviewFooter from "../components/InterviewFooter";
import { AssignmentTypes } from "../utils/constants";
import "../styles/dark_mode.css";

function InterviewPageContainer() {
  const interview = {
    sections: [
      {
        assignments: [
          {
            id: "randomid12345678",
            type: AssignmentTypes.MULTIPLE_CHOICE,
            isSolved: false,
            text: ["What will I get if I will sum 2 and 2?"],
            options: ["42", "Isaac Newton", "Madagaskar"],
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
      <InterviewHeader interview={interview} />

      <InterviewMain interview={interview} />

      <InterviewFooter />
    </div>
  );
}

export default InterviewPageContainer;
