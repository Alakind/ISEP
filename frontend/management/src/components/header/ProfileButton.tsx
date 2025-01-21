import "../../styles/profile-button.css";
import {ReactNode} from "react";
import {Link} from "react-router-dom";

function ProfileButton({currentUser, handleLogout}: Readonly<Props>): ReactNode {
  return (
    <span className="profile-button" data-testid={"profile-button"}>
      <li className="navbar-nav dropdown">
        <button className={`nav-link btn--transparent`} data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-person-circle"></i>
          <span className="profile-button__name">{currentUser}</span>
        </button>
        <ul className="dropdown-menu">
          {/*TODO implement actual role*/}
          <li>Role: Admin</li>
          <li><hr className="dropdown-divider"/></li>
          <li><Link onClick={handleLogout} className="dropdown-item" to={`#`}>Logout</Link></li>
        </ul>
      </li>
    </span>
  )
}

interface Props {
  currentUser: string;
  handleLogout: () => void;
}

export default ProfileButton
