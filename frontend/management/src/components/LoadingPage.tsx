import ReactLoading from 'react-loading';

function LoadingPage({errorMessage} : Props ) {
    return (
        <div className="page page--center">
            <ReactLoading type="spin" color='var(--text-primary)' height={'80px'} width={'80px'} />
            <br></br>
            <p>
                {errorMessage != null ? errorMessage.toString() : "Loading..."}
            </p>
        </div>
    )
}

export interface Props {
    errorMessage?: string;
}

export default LoadingPage
