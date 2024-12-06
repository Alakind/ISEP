import "../styles/custom-toast.css";

function CustomWarnToast({closeToast, proceedActionAdditional, cancelActionAdditional, message} : Props ) {
  function proceedAction() {
    proceedActionAdditional();
    closeToast();
  }

  function cancelAction() {
    cancelActionAdditional();
    closeToast();
  }

  return (<div className="custom-warn-toast__container">
    {message}
    <br/>
    <span className="custom-warn-toast__btn-container">
      <button className="btn btn--toast btn--toast--proceed" onClick={proceedAction}>Proceed</button>
      <button className="btn btn--toast btn--toast--cancel" onClick={cancelAction}>Cancel</button>
    </span>
  </div>)
}

interface Props {
  // closeToast:
  proceedActionAdditional: () => void;
  cancelActionAdditional: () => void;
  message: string;
}

export default CustomWarnToast
