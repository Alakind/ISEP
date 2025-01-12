import {ReactNode} from "react";

function ErrorBoundary({error}: Readonly<Props>): ReactNode {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error ? error.message : new Error("Page not found").message}</p>
    </div>
  )
}

export interface Props {
  error?: Error;
}

export default ErrorBoundary
