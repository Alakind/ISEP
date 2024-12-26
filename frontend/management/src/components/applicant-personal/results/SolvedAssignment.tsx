import {AssignmentSolvedInterface} from "../../../utils/types.tsx";
import {ChangeEvent, Children, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from "react";

function SolvedAssignment({assignment, index, handleScoreChange, children}: Props): ReactNode {
  return (
    <>
      <div className="assignment__header">
        <span className={"assignment__header__question"}>{index + 1}. {assignment.description}</span>
        <span className={"assignment__header__score"}>
          <input
            className={"assignment__header__score__scored-points"}
            type={"number"}
            defaultValue={assignment.scoredPoints ?? 0}
            min={0}
            max={assignment.availablePoints ?? 0}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => handleScoreChange(e, assignment.id, assignment.availablePoints)}
          /> / {assignment.availablePoints ?? 0}
        </span>
      </div>
      <div className="assignment__block">
        {Children.map(children, (child: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined): ReactNode =>
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
