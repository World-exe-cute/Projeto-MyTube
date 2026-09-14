import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { useEffect, useState, useRef, useContext } from "react";
import { Channel } from "../../App";
import "./UserProfile.css";
import UserVideos from "./SubProfile/UserVideos";
import UserPosts from "./SubProfile/UserPosts";
import SubScribe from "../../components/VideoPlayer/VideoInfoComponents/SubScribe";

export default function UserProfile({}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { load, tokenInfo } = useContext(Channel);
  const path = location.pathname.split("/");
  const [userInfo, setUserInfo] = useState();
  const { user } = useParams();

  const [containerHeight, setContainerHeight] = useState(false);
  const [moreDescription, setMoreDescription] = useState(false);
  const [screen, setScreen] = useState(window.innerWidth);
  const descriptionBar = useRef();
  useEffect(() => {
    const resize = () => {
      setScreen(window.innerWidth);
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (descriptionBar.current) {
      setContainerHeight(
        descriptionBar.current.offsetHeight >= 120 ? true : false,
      );
    }
  }, [userInfo]);

  useEffect(() => {
    getUserInfo();
  }, [user]);

  const getUserInfo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/users/check-tag/${user}`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setUserInfo(res.payload.userTag);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div id="user-profile">
      {userInfo && (
        <>
          {userInfo.photoUrl.pc?.hash ? (
            <div className={screen > 1920 ? "tv-box" : ""}>
              <img
                src={
                  screen < 765
                    ? userInfo.photoUrl?.cel.hash
                    : screen < 1920
                      ? userInfo.photoUrl?.pc.hash
                      : userInfo.photoUrl?.tv.hash
                }
              />
            </div>
          ) : (
            <div className="reset"></div>
          )}

          <div>
            <div>
              {userInfo.photoUrl.photo?.hash ? (
                <img
                  className="user-photo"
                  src={userInfo.photoUrl?.photo.hash}
                />
              ) : (
                <div className="default">
                  <div>{userInfo.name[0]}</div>
                </div>
              )}
            </div>
            <div>
              <section className="user-info">
                <h2 className="hidden-visual">Informaçoes da conta</h2>
                <div>{userInfo.name + " " + userInfo.lastName}</div>
                <div>{userInfo.idTag}</div>
                <div
                  ref={descriptionBar}
                  className={`description-box ${moreDescription ? "show-more" : ""}`}
                  tabIndex="-1"
                  onClick={() => {
                    setMoreDescription(true);
                    descriptionBar.current.focus();
                  }}
                  onBlur={() => {
                    setMoreDescription(false);
                    descriptionBar.current.blur();
                  }}
                >
                  <p>{userInfo.description}</p>
                </div>
                {containerHeight && (
                  <div className="more">{moreDescription ? "" : "mais..."}</div>
                )}
              </section>
              {tokenInfo.idTag === user ? (
                <nav className="user-option" aria-label="Opções do canal">
                  <Link to="/myStudio/customize/profile">
                    Personalizar o canal
                  </Link>
                  <Link to="/myStudio/channel/videos">Gerenciar vídeos</Link>
                </nav>
              ) : (
                <div className="sub-box">
                  <SubScribe
                    userInscription={userInfo.inscription}
                    userTag={userInfo.idTag}
                  />
                </div>
              )}
            </div>
          </div>
          <nav className="video-option">
            <Link
              className={path[2] === "videos" ? "active" : ""}
              to={`/profile/videos/${userInfo.idTag}`}
              onClick={(e) => {
                if (load.load) e.preventDefault();
              }}
            >
              Videos
            </Link>
            <Link
              className={path[2] === "posts" ? "active" : ""}
              to={`/profile/posts/${userInfo.idTag}`}
              onClick={(e) => {
                if (load.load) e.preventDefault();
              }}
            >
              Posts
            </Link>
          </nav>
          <p className="line-bottom"></p>
          <div>
            {path[2] === "videos" && (
              <>
                <UserVideos />
              </>
            )}
            {path[2] === "posts" && (
              <>
                <UserPosts userInfo={userInfo} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
