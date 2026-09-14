import "./FeedBorderVideos.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function FeedBorderVideos({
  index,
  refInfo,
  videos,
  css,
  boxWidth,
}) {
  const navigate = useNavigate();
  return (
    <>
      {videos?.videoUrl?.hash && (
        <NavLink
          key={index}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/videoView/${videos.videoUrl.hash}`);
          }}
          className={`video-border-container ${refInfo} ${css} reset-config`}
          ref={refInfo}
        >
          <div>
            <img
              src={`http://localhost:5000/api/videos/check-thumb/${videos.videoUrl.hash}`}
            />
          </div>
          <div>
            <div>
              <div className="title" style={{ width: `${boxWidth / 2}px` }}>
                {videos.title}
              </div>
              {css !== "search" && <div className="author">{videos.name}</div>}
              <div className="info-box">
                <div className="views">{`${videos.view} Visualizaçoes`}</div>
                <div className="view-espace">°</div>
                <div className="data">{videos.createdAt}</div>
              </div>
              {css === "search" && (
                <>
                  <div
                    className="profile-image"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/profile/videos/${videos.userId.idTag}`);
                    }}
                  >
                    {videos.userId.photoUrl?.photo?.hash ? (
                      <img src={`${videos.userId.photoUrl.photo.hash}`} />
                    ) : (
                      <div className="default">
                        <div>{videos.userId.name[0]}</div>
                      </div>
                    )}
                    <div className="author">{videos.userId.name}</div>
                  </div>

                  <div className="description">{videos.description}</div>
                </>
              )}
            </div>
          </div>
        </NavLink>
      )}
    </>
  );
}
