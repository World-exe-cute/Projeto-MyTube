import { useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "../NavbarComponents/SearchBar.css";

const SearchBar = ({ css, clickEvent, channel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const splitUrl = location.pathname.split("/")[3];

  return (
    <form
      id="search-bar"
      className="center-header"
      onClick={() => {
        if (clickEvent !== "false") {
          clickEvent(true);
        }
      }}
      onBlur={() => {
        if (clickEvent !== "false") {
          clickEvent(false);
        }
      }}
    >
      <div
        id="search-active"
        className={`${
          channel ? "search-channel" : active ? "active-input" : ""
        } ${channel ? (active ? "focus-channel" : "chanButton") : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        aria-hidden="true"
      >
        <i
          className={`fa-solid fa-magnifying-glass ${channel ? (active ? "focus-channel" : "chanButton") : ""}`}
        ></i>
      </div>
      <div className="input-box">
        <input
          ref={ref}
          type="text"
          placeholder={channel ? "Pesquise no seu canal" : "Pesquisar"}
          className={`${
            channel
              ? `input-channel ${active ? "focus-channel" : "reset-config"}`
              : `${css}`
          }`}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onClick={() => {
            setActive(true);
            if (clickEvent !== "false") {
              clickEvent(true);
            }
          }}
          onBlur={() => {
            setActive(false);

            if (clickEvent !== "false") {
              clickEvent(false);
            }
          }}
        />
        <button
          className={`${
            channel ? `chan-button ${active && "focus-channel"}` : `${css}`
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (channel) {
              if (searchValue === "") {
                navigate(
                  `/myStudio/channel/${splitUrl === "posts" ? "posts" : "videos"}/search/empty`,
                );
                navigate(0);
              } else {
                navigate(
                  `/myStudio/channel/${splitUrl === "posts" ? "posts" : "videos"}/search/${searchValue}`,
                );
                navigate(0);
              }
            } else {
              if (searchValue === "") {
                navigate(`/search/empty`);
                navigate(0);
              } else {
                navigate(`/search/${searchValue}`);
                navigate(0);
              }
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          aria-label={`${channel ? "limpar campo" : "pesquisar"}`}
        >
          {channel ? (
            <i
              onClick={() => {
                if (ref.current) {
                  ref.current.value = "";
                }
              }}
              className={`fa-solid fa-xmark ${active ? "showX" : "hidden"}`}
              aria-hidden="true"
            ></i>
          ) : (
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
