import "./OptionsChannel.css";
import { Link } from "react-router-dom";
import IconOptions from "../../SubChannel/IconOptions";
import { Channel } from "../../../../App";
import { useContext, useEffect, useRef } from "react";

export default function OptionsChannel({ active, userInfo }) {
  const { clickOption, focusOption } = useContext(Channel);
  const hiddenRef = useRef(null);

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

  return (
    <aside ref={hiddenRef} id="options-channel" className="">
      <Link
        className={`account ${active ? "active" : ""}`}
        to={`/profile/videos/${userInfo.idTag}`}
      >
        {userInfo.photoUrl ? (
          <img src={userInfo.photoUrl?.photo?.hash}></img>
        ) : (
          <>
            <div className="photo-box">
              <div>{userInfo.name?.[0]}</div>
            </div>
            <div className="title">Sua conta</div>
            <div className="user-name">{userInfo?.name}</div>
          </>
        )}
      </Link>
      <IconOptions
        text="Painel"
        css="fa-solid fa-table-cells-large"
        hidden={!active}
        location="panel"
      />
      <IconOptions
        text="Conteúdo"
        css="fa-solid fa-circle-play"
        hidden={!active}
        location="channel/videos"
      />
      <IconOptions
        text="Analytics"
        css="fa-solid fa-chart-simple"
        hidden={!active}
        location="analytics/overview"
      />
      <IconOptions
        text="Comunidade"
        css="fa-solid fa-users"
        hidden={!active}
        location="community/comments"
        ajust={true}
      />
      <IconOptions
        text="Direitos Autorais"
        css="fa-solid fa-copyright"
        hidden={!active}
        location="copyright/history"
        ajust={true}
      />
      <IconOptions
        text="Personalização"
        css="fa-solid fa-wand-magic-sparkles"
        hidden={!active}
        location="customize/profile"
        ajust={true}
      />
    </aside>
  );
}
