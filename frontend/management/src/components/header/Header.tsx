import ThemeSwitchContainer from "../../containers/header/ThemeSwitchContainer.tsx";
import {Bounce, ToastContainer} from "react-toastify";
import ProfileButtonContainer from "../../containers/header/ProfileButtonContainer.tsx";
import "../../styles/header.css"
import {ReactNode} from "react";

function Header({currentPage, urlPrefix}: Readonly<Props>): ReactNode {
  return (
    <header className="header">
      <span className="header__left">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href={`${urlPrefix}/dashboard`}><img src={`${import.meta.env.VITE_DOMAIN}/favicon-180x180.png`} width={30} alt="InfoSupport logo"/> Asserberus</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <i className="bi bi-list"></i>
              </span>
            </button>
            <div className="collapse navbar-collapse header__left__nav" id="navbarScroll">
              <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                <li className="nav-item">
                  <a className={`nav-link nav-link--mod ${currentPage == "applicants" ? "active" : ""}`} href={`${urlPrefix}/applicants`}><i className="bi bi-people-fill"></i>Applicants</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link nav-link--mod ${currentPage == "assessments" ? "active" : ""}`} href={`${urlPrefix}/assessments`}><i className="bi bi-clipboard"></i>Assessments</a>
                </li>
                <li className="nav-item">
                  {/*TODO hide this tab if the logged person doesn't have access (isn't an admin)*/}
                  <a className={`nav-link nav-link--mod ${currentPage == "users" ? "active" : ""}`} href={`${urlPrefix}/users`}><i className="bi bi-person-rolodex"></i>Users</a>
                </li>
              </ul>
              <span className="navbar-text navbar-text--mod">
                <ProfileButtonContainer urlPrefix={urlPrefix}/>
                <ThemeSwitchContainer/>
              </span>
            </div>
          </div>
        </nav>
      </span>
      <span className="header__center">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </span>
    </header>
  )
}

interface Props {
  currentPage: string;
  urlPrefix: string;
}

export default Header
