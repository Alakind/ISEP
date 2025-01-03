import {ReactNode} from "react";

function ErrorBoundary({error}: Props): ReactNode {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
    </div>
  )
}

export interface Props {
  error: Error;
}

export default ErrorBoundary
