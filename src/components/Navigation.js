import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => (
  <nav>
    <ul className="nav">
      <li className="nav_home">
        <Link to="/">
          <FontAwesomeIcon
            className="fa_home"
            icon={faTwitter}
            color={"#04AAFF"}
            size="2x"
          />
        </Link>
      </li>
      <li className="nav_profile">
        <Link to="/profile">
          <FontAwesomeIcon
            className="fa_profile"
            icon={faUser}
            color={"#04AAFF"}
            size="2x"
          />
          <span className="nav_name">{userObj.displayName}'s Profile</span>
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
