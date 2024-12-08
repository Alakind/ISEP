function Button({isDisabled = false, activeTooltip = false, handleClick, btnClasses, iconClass, spanTextClass, text} : Props) {
  return (
    <button
      disabled={isDisabled}
      className={`btn btn--mod ${btnClasses}`}
      onClick={handleClick}
      data-toggle={activeTooltip ? "tooltip" : ""}
      data-placement={activeTooltip ? "bottom" : ""}
      title={activeTooltip ? text : ""}
    >
      {iconClass ? <i className={`bi ${iconClass}`}></i> : <></>}
      <span className={spanTextClass}>{text}</span>
    </button>
  )
}

interface Props {
  handleClick: (arg0? : any) => void;
  btnClasses: string;
  iconClass?: string;
  spanTextClass: string;
  text: string;
  isDisabled?: boolean;
  activeTooltip?: boolean;
}

export default Button
