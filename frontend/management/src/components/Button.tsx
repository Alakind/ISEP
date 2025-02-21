import {MouseEvent} from "react";

function Button({isDisabled = false, activeTooltip = false, handleClick, btnClasses, iconClass, spanTextClass, text}: Readonly<Props>) {
  return (
    <button
      disabled={isDisabled}
      className={`btn btn--mod ${btnClasses ?? ""}`}
      onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e)}
      data-toggle={activeTooltip ? "tooltip" : null}
      data-placement={activeTooltip ? "bottom" : null}
      title={activeTooltip ? text : undefined}
      data-testid={text}
    >
      {iconClass ? <i className={`bi ${iconClass}`}></i> : <></>}
      <span className={spanTextClass}>{text}</span>
    </button>
  )
}

interface Props {
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
  btnClasses?: string;
  iconClass?: string;
  spanTextClass: string;
  text: string;
  isDisabled?: boolean;
  activeTooltip?: boolean;
}

export default Button
