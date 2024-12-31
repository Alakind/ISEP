import {Children, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from 'react';

function CardBodyContainer({children}: Readonly<Props>): ReactNode {
  return (
    <div className={"card-page__body"} data-testid={"card-body-container"}>
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

export default CardBodyContainer