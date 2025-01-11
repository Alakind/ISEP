import {Children, ReactNode} from 'react';

function CardBodyContainer({children, additionalClass}: Readonly<Props>): ReactNode {
  return (
    <div className={`card-page__body ${additionalClass ?? ""}`} data-testid={"card-body-container"}>
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
  additionalClass?: string;
}

export default CardBodyContainer