import { NavLink, useNavigate } from "react-router-dom";
import "./FeedVideos.css";
import UserChannel from "./VideoInfoComponents/UserChannel";

export default function FeedVideos({ index, videos }) {
  const navigate = useNavigate();
  return (
    <>
      {videos?.videoUrl?.hash && (
        <NavLink
          key={index}
          to={`/videoView/${videos.videoUrl.hash}`}
          className="video-container reset-config"
        >
          <div>
            <img
              src={`http://localhost:5000/api/videos/check-thumb/${videos.videoUrl.hash}`}
            />
          </div>
          <div>
            <UserChannel url={videos.userPhoto} name={videos.name} />
            <div>
              <div className="title">{videos.title}</div>
              <div
                className="author"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(`/profile/videos/${videos.userTag}`);
                }}
              >
                {videos.name}
              </div>
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
