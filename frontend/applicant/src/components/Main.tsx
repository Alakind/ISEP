import Assignment from "../components/Assignment";
import {AssessmentInterface, AssignmentCodingInterface, AssignmentInterface} from "../utils/types";
import "../styles/dark_mode-main.css";
import scrollToAssignment from "../utils/operations.tsx";
import {useEffect} from "react";
import {AssignmentTypes} from "../utils/constants.tsx";
import AssignmentCoding from "./AssignmentCoding.tsx";

function Main({ assessment, currentSectionIndex, currentAssignmentIndex }: Props) {
    useEffect(() => {
        scrollToAssignment(
            assessment.sections[currentSectionIndex].assignments[currentAssignmentIndex[currentSectionIndex]].id
        );
    }, [currentSectionIndex, currentAssignmentIndex]);

  return (
    <main>
      <div className="main__container">
          {assessment.sections[currentSectionIndex].assignments.map((assignment: AssignmentInterface, i: number) => {
              if (assignment.type === AssignmentTypes.CODING) {
                  if (i === currentAssignmentIndex[currentSectionIndex]) {
                      return (
                          <div className="assignment" key={assignment.id} id={assignment.id}>
                              <Assignment index={i} assignment={assignment} />
                          </div>
                      );
                  } else {
                      return null;
                  }
              } else {
                  return (
                      <div className="assignment" key={assignment.id} id={assignment.id}>
                          <Assignment index={i} assignment={assignment} />
                      </div>
                  );
              }
          })}
      </div>
    </main>
  );
}

interface Props {
    assessment: AssessmentInterface;
    currentSectionIndex: number;
    currentAssignmentIndex: number[];
}

export default Main;
