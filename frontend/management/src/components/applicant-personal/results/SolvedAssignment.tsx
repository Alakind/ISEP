import {AssignmentSolvedInterface} from "../../../utils/types.tsx";
import {ChangeEvent, Children, ReactNode} from "react";
import {useUserData} from "../../../utils/msal/UseUserData.tsx";
import {Roles} from "../../../utils/constants.tsx";

function SolvedAssignment({assignment, index, handleScoreChange, children}: Readonly<Props>): ReactNode {
  const user = useUserData();
  return (
    <>
      <div className="assignment__header" data-testid={"assignment-header"}>
        <span className={"assignment__header__question"}>{index + 1}. {assignment.description}</span>
        <span className={"assignment__header__score"}>
          {
            user.role === Roles.INTERVIEWER || user.role === Roles.ADMIN
              ? (
                <input
                  className={"assignment__header__score__scored-points"}
                  name={`input__score-${assignment.id}`}
                  id={`input__score-${assignment.id}`}
                  type={"number"}
                  defaultValue={assignment.scoredPoints ?? 0}
                  min={0}
                  max={assignment.availablePoints}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void => handleScoreChange(e, assignment.id, assignment.availablePoints)}
                />
              ) : (
                <span className={"assignment__header__score__scored-points"}>
                  {assignment.scoredPoints ?? 0}
                </span>
              )
          } / {assignment.availablePoints}
        </span>
      </div>
      <div className="assignment__block" data-testid={"assignment-block"}>
        {Children.map(children, (child: ReactNode): ReactNode =>
          <>
            {child}
          </>
        )}
      </div>
    </>
  );
}

interface Props {
  assignment: AssignmentSolvedInterface;
  index: number;
  handleScoreChange: (e: ChangeEvent<HTMLInputElement>, id: string, max: number) => void;
  children: ReactNode;
}

export default SolvedAssignment
