import {Children, ReactNode} from 'react';

function CardBodyContainer({children}: Readonly<Props>): ReactNode {
  return (
    <div className={"card-page__body"} data-testid={"card-body-container"}>
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

export default CardBodyContainer