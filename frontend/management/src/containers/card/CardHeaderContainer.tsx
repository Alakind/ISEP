import {Children, ReactNode} from 'react'

function CardHeaderContainer({children}: Readonly<Props>): ReactNode {
  return (
    <div className={"card-page__header"} data-testid={"card-header-container"}>
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

export default CardHeaderContainer