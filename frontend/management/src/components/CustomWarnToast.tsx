import "../styles/custom-toast.css";
import {ReactNode} from "react";

function CustomWarnToast({proceedAction, cancelAction, message}: Readonly<Props>): ReactNode {
  return (
    <div className="custom-warn-toast__container" data-testid="custom-warn-toast">
      {message}
      <br/>
      <span className="custom-warn-toast__btn-container">
        <button className="btn btn--toast btn--toast--proceed" onClick={proceedAction} data-testid="proceed-button">Proceed</button>
        <button className="btn btn--toast btn--toast--cancel" onClick={cancelAction} data-testid="cancel-button">Cancel</button>
      </span>
    </div>)
}

interface Props {
  proceedAction: () => void;
  cancelAction: () => void;
  message: string;
}

export default CustomWarnToast
