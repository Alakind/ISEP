import InterviewHeader from "../components/InterviewHeader";
import { AssignmentTypes } from "../utils/constants";

function InterviewPageContainer() {
  const section = {
    assignments: [
      {
        type: AssignmentTypes.MULTIPLE_CHOICE,
        isSolved: false,
      },
    ],
  };

  return (
    <>
      <h1>Interview page!</h1>
      <InterviewHeader section={section} />
      <div></div>
      <div>Footer</div>
    </>
  );
}

export default InterviewPageContainer;
