import { useEffect, useState, useRef } from "react";
import "./VideoInscriptions.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";

//components
import FeedVideos from "../../components/VideoPlayer/FeedVideos";
import ObserverEffect from "../../utils/ObserverEffect";

export default function VideoInscriptions({ global }) {
  const dispatch = useDispatch();
  const [allVideos, setAllVideos] = useState([]);
  const [videoHash, setVideoHash] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const allVideoNum = useRef(0);
  const observerRef = useRef();

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    const formData = {};
    const infoData = {};

    formData.frontHash = videoHash;
    infoData.fetch = `/home/getVideos/inscriptions`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setAllVideos((e) => [...e, ...res.payload.videos]);
      setVideoHash((e) => [...e, ...res.payload.hash]);

      if (res.payload.lock) {
        setCancelObserver(true);
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

  return (
    <div id="video-inscription" className={`${global ? "active" : ""}`}>
      <div>
        <div>Mais recentes</div>
        <NavLink to="/user/channels">Todas as inscrições</NavLink>
      </div>
      <div>
        {allVideos.length !== 0 &&
          allVideos.map((item, i) => (
            <div key={i} ref={allVideos.length - 1 === i ? observerRef : null}>
              <FeedVideos index={i} videos={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
