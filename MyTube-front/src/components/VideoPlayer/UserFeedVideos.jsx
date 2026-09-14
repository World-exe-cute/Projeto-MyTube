import "./UserFeedVideos.css";
import { NavLink } from "react-router-dom";

export default function UserFeedVideos({ index, videos, refInfo }) {
  return (
    <>
      {videos?.videoUrl?.hash && (
        <NavLink
          key={index}
          to={`/videoView/${videos.videoUrl.hash}`}
          className="feed-video-container reset-config"
          ref={refInfo}
        >
          <div>
            <img
              src={`http://localhost:5000/api/videos/check-thumb/${videos.videoUrl.hash}`}
            />
          </div>
          <div>
            <div>
              <div className="title">{videos.title}</div>
              <div className="info-box">
                <div className="views">{`${videos.view} Visualizaçoes`}</div>
                <div className="view-espace">°</div>
                <div className="data">{videos.createdAt}</div>
              </div>
            </div>
          </div>
        </NavLink>
      )}
    </>
  );
}
