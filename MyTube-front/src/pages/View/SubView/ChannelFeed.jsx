import { NavLink } from "react-router-dom";
import "./ChannelFeed.css";
import SubScribe from "../../../components/VideoPlayer/VideoInfoComponents/SubScribe";

export default function ChannelFeed({ index, channel }) {
  return (
    <NavLink
      index={index}
      to={`/profile/videos/${channel.idTag}`}
      className="channel-feed"
    >
      <div>
        {channel.photoUrl.photo.hash ? (
          <img src={`${channel.photoUrl.photo.hash}`} />
        ) : (
          <div className="default">
            <div>{channel.name[0]}</div>
          </div>
        )}
      </div>
      <div>
        <div>
          <div className="name">{channel.name}</div>
          <div className="info-box">
            <div className="tag">{channel.idTag}</div>
            <div className="view-espace">°</div>
            <div className="data">{`${channel.inscription} inscritos`}</div>
          </div>
          <div className="description">{channel.description}</div>
        </div>
        <div
          className="sub-box"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <SubScribe
            userInscription={channel.myInscription}
            userTag={channel.idTag}
          />
        </div>
      </div>
    </NavLink>
  );
}
