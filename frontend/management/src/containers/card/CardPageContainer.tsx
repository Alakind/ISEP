import {Children, ReactNode} from "react";
import "../../styles/card-page.css";

function CardPageContainer({children}: Readonly<Props>): ReactNode {
  return (
    <div className={"card-page"}>
      {Children.map(children, (child: ReactNode): ReactNode =>
        <>
          {child}
        </>
      )}
    </div>
  );
}

interface Props {
  children: ReactNode;
}

export default CardPageContainer