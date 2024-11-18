import React from 'react'
import "../styles/dark_mode.css";
import "../styles/dark_mode-page_not_found.css"
import {Link} from "react-router-dom";
import InfoSupportMailSupport from "../components/InfoSupportMailSupport.tsx";

function PageNotFoundContainer() {
    return (
        <div className="page page-not-found">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>
                Sorry, the page you are looking for does not exist. <br></br>
                You can go back to the <Link to={"/"}>welcome page</Link> or <InfoSupportMailSupport element={"request support"} />.
            </p>
        </div>
    )
}

export default PageNotFoundContainer
