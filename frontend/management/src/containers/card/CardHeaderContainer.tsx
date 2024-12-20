import {Children, JSXElementConstructor, ReactElement, ReactNode, ReactPortal} from 'react'

function CardHeaderContainer({children}: Props): ReactNode {
  return (
    <div className={"card-page__header"}>
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

export default CardHeaderContainer