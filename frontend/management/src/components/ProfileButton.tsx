import "../styles/profile-button.css";
import React from "react";


function ProfileButton({urlPrefix, currentUser} : Props) {
  return (
    <span className="profile-button">
      <li className="navbar-nav dropdown">
        <a className={`nav-link`} href="#" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-person-circle"></i><span className="profile-button__name">{currentUser}</span></a>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href={`${urlPrefix}/profile`}>My profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href={`${urlPrefix}/logout`}>Logout</a></li>
        </ul>
      </li>
    </span>
  )
}

interface Props {
  urlPrefix: string;
  currentUser: string;
}

export default ProfileButton
