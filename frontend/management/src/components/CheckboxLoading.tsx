import {ReactNode} from "react";

function CheckboxLoading({id}: Props): ReactNode {
  return (
    <input
      className={`checkbox__input checkbox__input--loading`}
      id={id}
      type={"checkbox"}
      disabled={true}
    />
  )
}

interface Props {
  id: string;
}

export default CheckboxLoading
