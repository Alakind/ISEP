import "../styles/header.css"
import ThemeSwitch from "../components/ThemeSwitch.tsx";
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import ProfileButton from "../components/ProfileButton.tsx";

function HeaderContainer() {
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];
    setCurrentPage(path || "");
  }, []);

  return (
    <header className="header">
      <span className="header__left">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href={`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_SUBDOMAIN}/`}><img  src="../../public/favicon-180x180.png" width={30} alt="InfoSupport logo"/> Asserberus</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <i className="bi bi-list"></i>
              </span>
            </button>
            <div style={{justifyContent: "space-between"}} className="collapse navbar-collapse" id="navbarScroll">
              <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                <li className="nav-item">
                  <a className={`nav-link nav-link--mod ${currentPage == "applicants" ? "active" : ""}`} href={`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_SUBDOMAIN}/applicants`} ><i className="bi bi-people-fill"></i>Applicants</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link nav-link--mod ${currentPage == "assessments" ? "active" : ""}`} href={`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_SUBDOMAIN}/assessments`}><i className="bi bi-clipboard"></i>Assessments</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link nav-link--mod ${currentPage == "users" ? "active" : ""}`} href={`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_SUBDOMAIN}/users`}><i className="bi bi-person-rolodex"></i>Roles</a>
                </li>
              </ul>
              <span className="navbar-text navbar-text--mod">
                <ProfileButton />
                <ThemeSwitch />
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
          transition: Bounce
        />
      </span>
    </header>
  );
}

export default HeaderContainer;
