import "./Options.css";
import { useEffect, useState, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import { Channel } from "../../../App";

//Components
import { OptionsLinks, OptionSubs } from "./subComponents/OptionsComponents";
import Logo from "./Logo";
import ShowMoreButton from "./subComponents/ShowMoreButton";
import LoginButton from "./LoginButton";
import { NavLink, Link } from "react-router-dom";

const Options = ({ channel }) => {
  const dispatch = useDispatch();
  const [channels, setChannels] = useState(false);
  const [moreSubs, setMoreSubs] = useState(7);
  const { tokenInfo, clickOption, focusOption, widthInfo } =
    useContext(Channel);
  const hiddenRef = useRef(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const clickOut = (e) => {
      if (!hiddenRef.current?.contains(e.target)) {
        clickOption.setMoreOption(false);
        focusOption.setFocus(false);
      }
    };

    document.addEventListener("mousedown", clickOut);

    return () => {
      document.removeEventListener("mousedown", clickOut);
    };
  }, []);

  const getUserInfo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = "/home/getUserInfo";
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setChannels(res.payload.channels);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <aside
      ref={hiddenRef}
      id="options"
      className={`${widthInfo.winWidth >= 1180 ? "active" : ""}`}
    >
      <nav className="start-header" aria-label="Retornar para Home">
        <i className="fa-solid fa-bars" aria-hidden="true"></i>

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
      <nav className="block-bar" aria-label="Links uteis">
        <OptionsLinks
          text="Início"
          viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
          css="fa-solid fa-house"
          link={`/`}
        />
        <OptionsLinks
          text="Inscrições"
          viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
          css="fa-solid fa-circle-play"
          link={`/user/inscriptions`}
        />
        <OptionsLinks
          text="Você"
          viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
          css="fa-solid fa-user"
          link={
            tokenInfo.idTag ? `/profile/videos/${tokenInfo.idTag}` : "/login"
          }
        />
      </nav>
      {tokenInfo && (
        <nav className="block-bar" aria-label="Opçoes de canal">
          <NavLink
            aria-label="Seu canal"
            to={`/profile/videos/${tokenInfo.idTag}`}
          >
            <h2 aria-hidden="true">Você</h2>
            <div aria-hidden="true">
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </NavLink>

          <div className="margin-left">
            <OptionsLinks
              text="Histórico"
              css="fa-solid fa-clock-rotate-left"
              link={`/user/history`}
            />
            <OptionsLinks
              text="Seus vídeos"
              css="fa-regular fa-circle-play"
              link={`/myStudio/channel/videos`}
            />
            <OptionsLinks
              text='Vídeos com "Gostei"'
              css="fa-solid fa-thumbs-up"
              link={`/user/likes`}
            />
          </div>
        </nav>
      )}
      <nav className="block-bar" aria-label="Inscriçoes">
        {channels ? (
          <>
            <h2 aria-hidden="true">Inscrições</h2>
            {channels.slice(0, moreSubs).map((item, i) => (
              <OptionSubs
                key={i}
                icon={item.userId.photoUrl || false}
                name={item.userId.name}
                path={item.userId.idTag}
              />
            ))}
          </>
        ) : (
          <div className="login-container">
            <p>Faça login para curtir vídeos, comentar e se inscrever.</p>
            <LoginButton />
          </div>
        )}
        <ShowMoreButton count={channels.length} funcCount={setMoreSubs} />
      </nav>
      <nav className="block-bar" aria-label="Outras opçoes">
        <h2 aria-hidden="true">Explorar</h2>
        <OptionsLinks text="Em Alta" css="fa-solid fa-fire" />
      </nav>
      <nav className="block-bar" aria-label="Mais sobre Rodrigo">
        <h2 aria-hidden="true">Mais de Rodrigo</h2>
      </nav>
      <nav
        className="block-bar margin-bottom"
        aria-label="Configuraçoes e ajuda"
      >
        <Link to="/feedback" className="feedback-link">
          Feedback
        </Link>
      </nav>
    </aside>
  );
};

export default Options;
