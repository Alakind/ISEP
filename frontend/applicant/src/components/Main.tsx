import Assignment from "../components/Assignment";
import {AssessmentInterface, AssignmentInterface} from "../utils/types";
import "../styles/main.css";
import scrollToAssignment from "../utils/operations.tsx";
import {useEffect, useState} from "react";
import {AssignmentTypes} from "../utils/constants.tsx";

function Main({
                assessment,
                currentSectionIndex,
                currentAssignmentIndex,
                setAssignmentAnswer,
              }: Readonly<Props>) {
  useEffect(() => {
    scrollToAssignment(
      assessment.sections[currentSectionIndex].assignments[
        currentAssignmentIndex[currentSectionIndex]
        ].id
    );
  }, [currentSectionIndex, currentAssignmentIndex]);

  const [isCurrentCoding, setIsCurrentCoding] = useState(false);

  useEffect(() => {
    setIsCurrentCoding(
      assessment.sections[currentSectionIndex].assignments[
        currentAssignmentIndex[currentSectionIndex]
        ].type === AssignmentTypes.CODING
    );
  }, [currentSectionIndex, currentAssignmentIndex, assessment.sections]);

  return (
    <main>
      <div className="main__container">
        {assessment.sections[currentSectionIndex].assignments.map(
          (assignment: AssignmentInterface, i: number) => {
            if (assignment.type === AssignmentTypes.CODING) {
              if (i === currentAssignmentIndex[currentSectionIndex]) {
                return (
                  <div
                    className="assignment"
                    key={assignment.id}
                    id={assignment.id}
                  >
                    <Assignment
                      index={i}
                      assignment={assignment}
                      setAssignmentAnswer={(answer: object) => {
                        setAssignmentAnswer(currentSectionIndex, i, answer);
                      }}
                    />
                  </div>
                );
              }
              return null;
            } else {
              if (isCurrentCoding) {
                return null;
              }
              return (
                <div
                  className="assignment"
                  key={assignment.id}
                  id={assignment.id}
                >
                  <Assignment
                    index={i}
                    assignment={assignment}
                    setAssignmentAnswer={(answer: object) => {
                      setAssignmentAnswer(currentSectionIndex, i, answer);
                    }}
                  />
                </div>
              );
            }
          }
        )}
      </div>
    </main>
  );
}

interface Props {
  assessment: AssessmentInterface;
  currentSectionIndex: number;
  currentAssignmentIndex: number[];
  setAssignmentAnswer: (arg1: number, arg2: number, arg3: object) => void;
}

export default Main;
