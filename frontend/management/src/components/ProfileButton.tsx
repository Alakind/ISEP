import "../styles/profile-button.css";
import React from "react";


function ProfileButton() {
  return (
    <span className="profile-button">
      <li className="navbar-nav dropdown">
        <a className={`nav-link`} href="#" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-person-circle"></i><span className="profile-button__name">Jurre</span></a>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href={`./profile`}>My profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href={`./logout`}>Logout</a></li>
        </ul>
      </li>
    </span>
  )
}

export default ProfileButton
