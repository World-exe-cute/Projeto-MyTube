import { Link } from "react-router-dom";
import "./ChannelBar.css";
import IconOptions from "./SubChannel/IconOptions";

export default function ChannelBar({ active, userInfo }) {
  return (
    <div id="ChannelBar">
      <div>
        <Link
          className={`account ${!active ? "active" : ""}`}
          to={`/profile/videos/${userInfo?.idTag}`}
        >
          {userInfo.photoUrl.photo?.hash ? (
            <img src={userInfo.photoUrl.photo?.hash}></img>
          ) : (
            <>
              <div className="photo-box">
                <div>{userInfo.name?.[0]}</div>
              </div>
              <div className={`title ${active ? "hidden" : ""}`}>Sua conta</div>
              <div className={`user-name ${active ? "hidden" : ""}`}>
                {userInfo?.name}
              </div>
            </>
          )}
        </Link>

        <IconOptions
          text="Painel"
          css="fa-solid fa-table-cells-large"
          hidden={true}
          location="panel"
        />
        <IconOptions
          text="Conteúdo"
          css="fa-solid fa-circle-play"
          hidden={true}
          location="channel/videos"
        />
        <IconOptions
          text="Analytics"
          css="fa-solid fa-chart-simple"
          hidden={true}
          location="analytics/overview"
        />
        <IconOptions
          text="Comunidade"
          css="fa-solid fa-users"
          hidden={true}
          location="community/comments"
          ajust={true}
        />
        <IconOptions
          text="Direitos Autorais"
          css="fa-solid fa-copyright"
          hidden={true}
          location="copyright/history"
          ajust={true}
        />
        <IconOptions
          text="Personalização"
          css="fa-solid fa-wand-magic-sparkles"
          hidden={true}
          location="customize/profile"
          ajust={true}
        />
      </div>
    </div>
  );
}
