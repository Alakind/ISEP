import ThemeSwitchContainer from "../../containers/header/ThemeSwitchContainer.tsx";
import {Bounce, ToastContainer} from "react-toastify";
import ProfileButtonContainer from "../../containers/header/ProfileButtonContainer.tsx";
import "../../styles/header.css"
import {ReactNode} from "react";
import {Link, NavLink} from "react-router-dom";

function Header({currentPage}: Readonly<Props>): ReactNode {
  return (
    <header className="header" data-testid={"header"}>
      <span className="header__left">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" to={`/dashboard`}>
              <img src={`${import.meta.env.VITE_DOMAIN}/favicon-180x180.png`} width={30} alt="InfoSupport logo"/> Asserberus
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <i className="bi bi-list"></i>
              </span>
            </button>
            <div className="collapse navbar-collapse header__left__nav" id="navbarScroll">
              <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                <li className="nav-item">
                  <NavLink className={`nav-link nav-link--mod ${currentPage == "dashboard" ? "active" : ""}`} to={`/dashboard`}><i className="bi bi-columns-gap"></i>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={`nav-link nav-link--mod ${currentPage == "applicants" ? "active" : ""}`} to={"/applicants"}><i className="bi bi-people-fill"></i>Applicants</NavLink>
                </li>
                <li className="nav-item">
                  {/*TODO hide this tab if the logged person doesn't have access (isn't an admin)*/}
                  <NavLink className={`nav-link nav-link--mod ${currentPage == "users" ? "active" : ""}`} to={`/users`}><i className="bi bi-person-rolodex"></i>Users</NavLink>
                </li>
              </ul>
              <span className="navbar-text navbar-text--mod">
                <ProfileButtonContainer/>
                <ThemeSwitchContainer/>
              </span>
            </div>
          </div>
        </nav>
      </span>
      <span className="header__center" data-testid={"toast-container"}>
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
}

export default Header
