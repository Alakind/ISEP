import Assignment from "../components/Assignment";
import InterviewHeader from "../components/InterviewHeader";
import { AssignmentTypes } from "../utils/constants";

function InterviewPageContainer() {
  const section = {
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
  };

  return (
    <>
      <h1>Interview page!</h1>
      <InterviewHeader section={section} />
      <div>
        {section.assignments.map((assignment) => (
          <div key={assignment.id}>
            <Assignment assignment={assignment} />
          </div>
        ))}
      </div>
      <div>Footer</div>
    </>
  );
}

export default InterviewPageContainer;
