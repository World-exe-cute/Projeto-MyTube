import { useEffect, useState } from "react";
import "./OptionsComponents.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Channel } from "../../../../App";
import { useContext } from "react";
import UserChannel from "../../../VideoPlayer/VideoInfoComponents/UserChannel";

export function OptionsLinks({ text, viewCss, css, link, channel = false }) {
  const location = useLocation();
  const { showOption, tokenInfo } = useContext(Channel);
  const [urlRef, setUrlRef] = useState(window.location.pathname.split("/")[3]);

  useEffect(() => {
    setUrlRef(location.pathname.split("/")[3]);
  }, [location.pathname]);

  return (
    <NavLink
      className={`${viewCss} ${channel ? "transparent" : "reset-config"}`}
      to={
        channel
          ? urlRef !== "posts"
            ? undefined
            : `/profile/posts/${tokenInfo.idTag}`
          : link
      }
      onClick={
        channel && urlRef !== "posts"
          ? (e) => {
              e.preventDefault();
              showOption("show");
            }
          : undefined
      }
    >
      <div aria-hidden="true">
        <i className={css}></i>
      </div>
      <div>{text}</div>
    </NavLink>
  );
}
export function OptionSubs({ icon, name, path }) {
  return (
    <NavLink className="option-subs" to={`/profile/videos/${path}`}>
      <UserChannel url={icon.hash} name={name} />
      <div>{name}</div>
    </NavLink>
  );
}

export function MoreOptions({ text, varText, css, next }) {
  return (
    <div
      className="options"
      onClick={() => {
        next[0](next[1]);
      }}
    >
      <div aria-hidden="true">
        <i className={css}></i>
      </div>
      <div>{text + " " + varText}</div>
      <div aria-hidden="true">
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
}

export function CircleOptions({ css = "", route, text = "" }) {
  return (
    <Link to={route} className="back-circle">
      <i className={css} aria-hidden="true"></i>
      <div>{text}</div>
    </Link>
  );
}
