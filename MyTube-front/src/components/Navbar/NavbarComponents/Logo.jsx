import "./Logo.css";
import { Link } from "react-router-dom";

const Logo = ({ text, css }) => {
  return (
    <div className="logo">
      <i aria-hidden="true" className={`fa-brands fa-youtube ${css.logo} `}></i>
      <Link className={css.link} to="/">
        {text}
      </Link>
    </div>
  );
};

export default Logo;
