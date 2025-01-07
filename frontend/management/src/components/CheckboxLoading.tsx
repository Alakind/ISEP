import {ReactNode} from "react";

function CheckboxLoading({id}: Readonly<Props>): ReactNode {
  return (
    <input
      className={`checkbox__input checkbox__input--loading`}
      id={id}
      type={"checkbox"}
      disabled={true}
      data-testid={"checkbox-loading"}
    />
  )
}

interface Props {
  id: string;
}

export default CheckboxLoading
