import {AssignmentSolvedInterface} from "../../../utils/types.tsx";
import {Children, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from "react";

function SolvedAssignment({assignment, index, children}: Props): ReactNode {
  return (
    <>
      <div className="assignment__header"><span>{index + 1}. {assignment.description}</span><span>{assignment.scoredPoints ?? 0} / {assignment.availablePoints ?? 0}</span></div>
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
  children: ReactNode;
}

export default SolvedAssignment
