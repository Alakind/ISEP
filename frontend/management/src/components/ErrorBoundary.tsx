function ErrorBoundary({ error } : Props) {
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
