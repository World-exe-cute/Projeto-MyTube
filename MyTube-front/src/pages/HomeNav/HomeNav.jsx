import { useEffect, useRef, useState, useContext } from "react";
import "./HomeNav.css";
import { Channel } from "../../App";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";

//components
import FeedVideos from "../../components/VideoPlayer/FeedVideos";
import ObserverEffect from "../../utils/ObserverEffect";

export default function HomeNav({ global }) {
  const dispatch = useDispatch();
  const { tagInfo } = useContext(Channel);
  const [allVideos, setAllVideos] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const [videoHash, setVideoHash] = useState([]);
  const [block, setBlock] = useState(false);

  const observerRef = useRef();
  const feedRef = useRef(null);

  useEffect(() => {
    if (!block) {
      getVideos(true);
    }
  }, [tagInfo.tagInfo]);

  const getVideos = async (reload = false) => {
    setBlock(true);
    const formData = {};
    const infoData = {};

    if (!reload) {
      formData.frontHash = videoHash;
    } else {
      formData.frontHash = [];
      feedRef.current.scrollTop = 0;
    }

    formData.frontTag = tagInfo.tagInfo;
    formData.order = true;
    infoData.fetch = `/home/getHomeVideos/home`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      if (!reload) {
        setAllVideos((e) => [...e, ...res.payload.videos]);
        setVideoHash((e) => [...e, ...res.payload.hash]);
      } else {
        setAllVideos(res.payload.videos);
        setVideoHash(res.payload.hash);
      }

      if (res.payload.lock) {
        setCancelObserver(true);
      }
    } else {
      const parse = res.payload;
      console.log(parse);
    }
    setTimeout(() => {
      setBlock(false);
    }, 500);
  };

  ObserverEffect({
    fetchInfo: allVideos,
    fetchFunc: getVideos,
    blockRef: observerRef,
    cancelRef: cancelObserver,
  });

  return (
    <div ref={feedRef} id="home-nav" className={`${global ? "active" : ""}`}>
      {allVideos.length !== 0 &&
        allVideos.map((item, i) => (
          <div
            key={item.videoUrl.hash}
            ref={allVideos.length - 1 === i ? observerRef : null}
          >
            <FeedVideos index={i} videos={item} />
          </div>
        ))}
    </div>
  );
}
