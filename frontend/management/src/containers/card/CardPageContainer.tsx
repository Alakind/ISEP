import {Children, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from "react";
import "../../styles/card-page.css";

function CardPageContainer({children}: Props): ReactNode {
  return (
    <div className={"card-page"}>
      {Children.map(children, (child: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined): ReactNode =>
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