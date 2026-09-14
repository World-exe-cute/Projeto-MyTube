import "./VideoLike.css";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import FeedBorderVideos from "../../components/VideoPlayer/FeedBorderVideos";

export default function VideoLike() {
  const dispatch = useDispatch();
  const [videoLike, setVideoLike] = useState([]);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    getLikeVideos();
  }, []);

  const getLikeVideos = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/users/getLikeVideos`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setVideoLike(res.payload.likeVideo);
      setUserInfo(res.payload.userInfo);

      if (res.payload.likeVideo.length !== 0) {
        document.documentElement.style.setProperty(
          "--img-like",
          `url(http://localhost:5000/api/videos/check-thumb/${res.payload.likeVideo[0].videoUrl.hash})`,
        );
      }
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <>
      {videoLike.length !== 0 ? (
        <div
          id="video-like"
          className={`${window.innerWidth < 900 ? "row" : ""}`}
        >
          <div className="background-video">
            <img
              crossOrigin="anonymous"
              src={`http://localhost:5000/api/videos/check-thumb/${videoLike[0].videoUrl.hash}`}
            />

            <div>
              <div>Videos com "Gostei"</div>
              <div>
                <div>{userInfo && userInfo}</div>
                <div>{videoLike && videoLike.length}</div>
              </div>
            </div>
          </div>

          <div>
            {videoLike.map((item, i) => (
              <FeedBorderVideos key={i} index={i} videos={item} css="like" />
            ))}
          </div>
        </div>
      ) : (
        <div id="video-like-empty">
          <h2>Nenhum video curtido.</h2>
        </div>
      )}
    </>
  );
}
