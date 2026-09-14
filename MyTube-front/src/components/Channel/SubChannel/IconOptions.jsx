import { Link, useLocation } from "react-router-dom";
import "./IconOptions.css";

export default function IconOptions({
  text,
  css,
  hidden = false,
  location,
  ajust = false,
}) {
  return (
    <Link
      id="icon-options"
      className={!hidden ? "check" : ""}
      to={`/myStudio/${location}`}
    >
      <i className={css}></i>
      <div
        className={hidden ? "hidden" : ""}
        style={{ left: ajust ? 0 : "none" }}
      >
        {text}
      </div>
    </Link>
  );
}
