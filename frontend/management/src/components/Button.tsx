function Button({isDisabled = false, activeTooltip = false, isModal = false, modalTargetId, handleClick, btnClasses, iconClass, spanTextClass, text}: Props) {
  return (
    <button
      disabled={isDisabled}
      className={`btn btn--mod ${btnClasses ?? ""}`}
      onClick={handleClick}
      data-toggle={activeTooltip && isModal ? "tooltip modal" : activeTooltip ? "tooltip" : isModal ? "modal" : ""}
      data-placement={activeTooltip ? "bottom" : ""}
      data-target={modalTargetId ?? ""}
      title={activeTooltip ? text : ""}
    >
      {iconClass ? <i className={`bi ${iconClass}`}></i> : <></>}
      <span className={spanTextClass}>{text}</span>
    </button>
  )
}

interface Props {
  handleClick: () => void;
  btnClasses?: string;
  iconClass?: string;
  spanTextClass: string;
  text: string;
  isDisabled?: boolean;
  activeTooltip?: boolean;
  isModal?: boolean;
  modalTargetId?: string;
}

export default Button
