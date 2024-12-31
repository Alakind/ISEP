import "../../styles/profile-button.css";
import {ReactNode} from "react";

function ProfileButton({urlPrefix, currentUser}: Readonly<Props>): ReactNode {
  return (
    <span className="profile-button">
      <li className="navbar-nav dropdown">
        <button className={`nav-link btn--transparent`} data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-person-circle"></i>
          <span className="profile-button__name">{currentUser}</span>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href={`${urlPrefix}/profile`}>My profile</a></li>
          <li><a className="dropdown-item" href={`${urlPrefix}/settings`}>Settings</a></li>
          <li><hr className="dropdown-divider"/></li>
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
