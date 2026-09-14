import "./VideoView.css";
import { useEffect, useState, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { useParams } from "react-router-dom";
import { Channel } from "../../App";

//components
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import VideoInfo from "../../components/VideoPlayer/VideoInfo";
import Comments from "../../components/VideoPlayer/Comments";
import FeedBorderVideos from "../../components/VideoPlayer/FeedBorderVideos";
import ObserverEffect from "../../utils/ObserverEffect";

//utils
import FeedVideos from "../../components/VideoPlayer/FeedVideos";

export default function VideoView({}) {
  const dispatch = useDispatch();
  const { viewMode, widthInfo } = useContext(Channel);

  const [allVideos, setAllVideos] = useState([]);
  const [observerReload, setObserverReload] = useState(true);
  const [currentVideo, setCurrentVideo] = useState();
  const [cancelObserver, setCancelObserver] = useState(false);
  const [videoHash, setVideoHash] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [clickVideos, setClickVideos] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [order, setOrder] = useState(true);
  const { id } = useParams();

  //passar como variavel o css para que o home/VideoView fique certo
  const observerRef = useRef();
  const allVideoNum = useRef(0);
  const collumRef = useRef();
  const lockObserver = useRef(false);
  const widthCollum = useRef(false);
  const videoBox = useRef(false);

  useEffect(() => {
    console.log(viewMode.changeTheater);
    if (viewMode.changeTheater === "active" && screenWidth > 880) {
      setTheaterMode("active");
    } else if (screenWidth < 1200) {
      setTheaterMode("active");
    } else {
      setTheaterMode("desactive");
    }
  }, [viewMode.changeTheater, screenWidth]);

  useEffect(() => {
    if (widthInfo < 1200) {
      setCancelObserver(true);
      lockObserver.current = true;
    } else {
      setCancelObserver(false);
      lockObserver.current = false;
    }
  }, [widthInfo]);

  useEffect(() => {
    if (clickVideos) {
      getVideos();
    }
  }, [clickVideos]);

  useEffect(() => {
    if (currentVideo) {
      getVideos();
    }
  }, [currentVideo]);

  useEffect(() => {
    getViewVideo();
  }, []);

  useEffect(() => {
    const resize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 1060 && !lockObserver.current) {
        setCancelObserver(true);
        setObserverReload(true);
      } else {
        setCancelObserver(false);
        setObserverReload(false);
      }
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const getViewVideo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/videos/getViewVideo/${id}`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setCurrentVideo(res.payload.videos);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  const getVideos = async () => {
    const formData = {};
    const infoData = {};

    formData.frontHash = videoHash;
    formData.frontTag = currentVideo.videoTag;
    formData.order = order;
    infoData.fetch = `/home/getHomeVideos/${id}`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const videoFilter = res.payload.videos.filter(
        (i) => i.videoUrl.hash !== id,
      );
      setAllVideos((e) => [...e, ...videoFilter]);
      setVideoHash((e) => [...e, ...res.payload.hash]);
      setClickVideos(false);
      if (res.payload.lock) {
        setCancelObserver(true);
        lockObserver.current = true;
      }
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: allVideos,
    fetchFunc: getVideos,
    blockRef: observerRef,
    cancelRef: cancelObserver,
    fetchNumRef: allVideoNum,
  });

  const videoOptions = {
    controls: true,
    inactivityTimeout: 500,
    responsive: true,
    fluid: false,
    sources: [
      {
        src: `http://localhost:5000/api/videos/check-video/${id}`,
        type: `video/${currentVideo?.videoUrl?.type}`,
      },
    ],
  };

  return (
    <div
      id="containerView"
      className={`${viewMode.darkMode === "dark" ? "dark" : "white"}  ${theaterMode === "active" ? "sub-box" : ""}`}
    >
      {currentVideo && (
        <>
          <div
            className={theaterMode === "active" ? "collum1" : "video-sub-block"}
          >
            <div>
              <VideoPlayer options={videoOptions} />
            </div>

            {theaterMode !== "active" && (
              <>
                <VideoInfo options={currentVideo} />
                <Comments
                  options={currentVideo}
                  fetchInfo="/videos"
                  setOrder={setOrder}
                />
              </>
            )}
          </div>
          {theaterMode === "active" ? (
            <div className={screenWidth < 1200 ? "box-mini" : "box-resize"}>
              <div
                ref={videoBox}
                className="collum1"
                style={{ width: `${videoBox.current?.clientWidth}` }}
              >
                <VideoInfo options={currentVideo} />
                {screenWidth > 1200 && (
                  <Comments
                    options={currentVideo}
                    fetchInfo="/videos"
                    setOrder={setOrder}
                  />
                )}
              </div>
              <div
                ref={collumRef}
                className={`collum2 ${screenWidth < 1200 && screenWidth > 880 ? "collum-dual" : ""}`}
              >
                {allVideos && screenWidth < 1200
                  ? allVideos
                      .slice(0, videoHash.length)
                      .map((item, i) => (
                        <FeedVideos key={i} index={i} videos={item} />
                      ))
                  : allVideos.map((item, i) => (
                      <FeedBorderVideos
                        key={i}
                        index={i}
                        videos={item}
                        refInfo={
                          allVideos.length - 1 === i ? observerRef : null
                        }
                        boxWidth={widthCollum.current?.clientWidth}
                      />
                    ))}
              </div>
              {!cancelObserver && (
                <div
                  className="more"
                  onClick={() => {
                    setClickVideos(true);
                  }}
                >
                  Mostrar mais
                </div>
              )}
              {screenWidth < 1200 && (
                <Comments
                  options={currentVideo}
                  fetchInfo="/videos"
                  setOrder={setOrder}
                />
              )}
            </div>
          ) : (
            <div ref={widthCollum} className="collum2">
              {allVideos &&
                allVideos.map((item, i) => (
                  <FeedBorderVideos
                    key={i}
                    refInfo={allVideos.length - 1 === i ? observerRef : null}
                    index={i}
                    videos={item}
                    boxWidth={widthCollum.current?.clientWidth}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
