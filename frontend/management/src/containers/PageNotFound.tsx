import "../styles/general.css";
import {Link} from "react-router-dom";
import {ReactNode} from "react";

function PageNotFound(): ReactNode {
    return (
        <div className="page page--center">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>
                Sorry, the page you are looking for does not exist. <br></br>
                You can go back to the <Link to={"/applicants"}>applicants dashboard</Link>.
            </p>
        </div>
    )
}

export default PageNotFound
