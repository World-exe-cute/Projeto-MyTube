import "./Navbar.css";
import { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";

//components
import Options from "../Navbar/NavbarComponents/Options";
import { Channel } from "../../App";
import SearchBar from "../Navbar/NavbarComponents/SearchBar";
import {
  OptionHidden,
  OptionHiddenGlobal,
} from "../Navbar/NavbarComponents/OptionHidden";
import OptionBar from "../Navbar/NavbarComponents/OptionBar";
import Logo from "../Navbar/NavbarComponents/Logo";
import { OptionsLinks } from "./NavbarComponents/subComponents/OptionsComponents";
import LoginButton from "./NavbarComponents/LoginButton";
import OptionsChannel from "../Channel/SubChannel/subComponents/OptionsChannel";
import LoadPage from "./NavbarComponents/subComponents/LoadPage";
import UserChannel from "../VideoPlayer/VideoInfoComponents/UserChannel";

const Navbar = ({ global, width, channel = null }) => {
  const location = useLocation();
  const [optionBarActive, setOptionBarActive] = useState(false);
  const [pathSplit, setPathSplit] = useState("");

  const ref = useRef();
  const { focusOption, userLogged, tokenInfo, clickOption, viewMode } =
    useContext(Channel);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOptionBarActive(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.addEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    setPathSplit(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <>
      <div
        id="nav"
        className={`${viewMode.darkMode ? viewMode.darkMode : "white"} ${channel ? "line-channel" : ""}`}
      >
        <header className={channel ? "channel" : ""}>
          <nav className="start-header" aria-label="">
            {pathSplit === "videoView" && (
              <>
                <OptionHidden
                  css="back-circle"
                  clickChange={clickOption.setMoreOption}
                  shadow={focusOption.setFocus}
                />
              </>
            )}
            {pathSplit !== "videoView" && width.winWidth >= 1180 && (
              <>
                <OptionHiddenGlobal
                  varClick={global[0]}
                  clickChange={global[1]}
                  css="back-circle"
                />
              </>
            )}
            {pathSplit !== "videoView" && width.winWidth <= 1179 && (
              <>
                <OptionHidden
                  css="back-circle"
                  clickChange={clickOption.setMoreOption}
                  shadow={focusOption.setFocus}
                />
              </>
            )}
            {channel ? (
              <Logo
                text="MyStudio"
                css={{ link: "reset-channel", logo: "logo-channel" }}
              />
            ) : (
              <Logo
                text="MyTube"
                css={{ link: "reset-config", logo: "logo-color" }}
              />
            )}
          </nav>

          <SearchBar
            clickEvent={channel ? focusOption.setFocus : "false"}
            css="reset-config"
            channel={channel ? true : false}
          />

          {userLogged === true && (
            <>
              <nav className="end-header">
                <div className="post-video">
                  <OptionsLinks
                    text="Criar"
                    viewCss="create"
                    css="fa-solid fa-plus"
                    link={`/profile/videos/${tokenInfo.idTag}`}
                    channel={channel}
                  />
                </div>
                <div
                  ref={ref}
                  className="profile-background"
                  onClick={() => {
                    setOptionBarActive(true);
                  }}
                >
                  <UserChannel
                    url={tokenInfo.photoUrl.photo?.hash}
                    name={tokenInfo.name[0]}
                  />
                  <OptionBar
                    active={optionBarActive}
                    style={0}
                    logged={userLogged}
                    userInfo={tokenInfo}
                  />
                </div>
              </nav>
            </>
          )}
          {userLogged === false && (
            <>
              <nav className="end-header">
                <div
                  ref={ref}
                  className="more-options"
                  onClick={() => {
                    setOptionBarActive(true);
                  }}
                  role="menu"
                  aria-expanded={`${optionBarActive ? "true" : "false"}`}
                  aria-controls="option-bar"
                  aria-label="mais opçoes"
                >
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    aria-hidden="true"
                  ></i>
                  <OptionBar
                    active={optionBarActive}
                    style={15}
                    logged={userLogged}
                  />
                </div>
                <LoginButton />
              </nav>
            </>
          )}
        </header>
        {!channel ? (
          <div
            id="bars-option"
            className={`${clickOption.moreOption ? "active" : ""}`}
          >
            <Options />
          </div>
        ) : (
          <div
            id="bars-channel"
            className={`${clickOption.moreOption ? "active" : ""}`}
          >
            <OptionsChannel
              active={clickOption.moreOption}
              userInfo={tokenInfo}
            />
          </div>
        )}

        <div className="notification"></div>
        <div className="perfil"></div>
      </div>
      <LoadPage />
    </>
  );
};

export default Navbar;
