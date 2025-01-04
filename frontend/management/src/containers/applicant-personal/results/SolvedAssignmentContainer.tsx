import {AssignmentSolvedInterface} from "../../../utils/types.tsx";
import {ChangeEvent, ReactNode} from "react";
import SolvedAssignment from "../../../components/applicant-personal/results/SolvedAssignment.tsx";
import {toast} from "react-toastify";
import {updateScoredPointsAssignment} from "../../../utils/apiFunctions.tsx";

function SolvedAssignmentContainer({assignment, assignmentIndex, sectionIndex, children}: Readonly<Props>): ReactNode {
  function handleScoreChange(e: ChangeEvent<HTMLInputElement>, id: string, max: number): void {
    const value = Number(e.target.value);

    if (value < 0 || value > max) {
      toast.warning("Value must be greater than 0 and less than max value!");

      if (value < 0) {
        e.target.value = "0";
      } else {
        e.target.value = `${max}`;
      }

      return;
    }

    updateScore(id, value).then();
  }

  async function updateScore(id: string, value: number): Promise<void> {
    try {
      await updateScoredPointsAssignment(id, value);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  }

  return (
    <SolvedAssignment assignment={assignment} index={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} handleScoreChange={handleScoreChange}>
      {children}
    </SolvedAssignment>
  )
}

interface Props {
  assignment: AssignmentSolvedInterface;
  assignmentIndex: number;
  sectionIndex: number;
  children: ReactNode;
}

export default SolvedAssignmentContainer
