import "./LoginButton.css";
import { NavLink } from "react-router-dom";

export default function LoginButton() {
  return (
    <div className="login">
      <i className="fa-solid fa-circle-user" aria-hidden="true"></i>
      <NavLink className="reset-config" to="/login">
        Fazer login
      </NavLink>
    </div>
  );
}
