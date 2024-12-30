import ReactLoading from 'react-loading';
import {ReactNode} from "react";

function LoadingPage({errorMessage, additionalClasses, size, showMessage}: Props): ReactNode {
  return (
    <div className={`page page--center ${additionalClasses}`}>
      <ReactLoading type="spin" color='var(--text-primary)' height={`${size ?? "80"}px`} width={`${size ?? "80"}px`}/>
      <br></br>
      {showMessage ?
        <>
          <p>
            {errorMessage != null ? errorMessage.toString() : "Loading..."}
          </p>
        </>
        : <></>
      }
    </div>
  )
}

export interface Props {
  errorMessage?: string;
  additionalClasses?: string;
  size?: number;
  showMessage?: boolean;
}

export default LoadingPage
