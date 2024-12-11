import ReactLoading from 'react-loading';
import {ReactNode} from "react";

function LoadingPage({errorMessage, additionalClasses}: Props): ReactNode {
  return (
    <div className={`page page--center ${additionalClasses}`}>
      <ReactLoading type="spin" color='var(--text-primary)' height={'80px'} width={'80px'}/>
      <br></br>
      <p>
        {errorMessage != null ? errorMessage.toString() : "Loading..."}
      </p>
    </div>
  )
}

export interface Props {
  errorMessage?: string;
  additionalClasses?: string;
}

export default LoadingPage
