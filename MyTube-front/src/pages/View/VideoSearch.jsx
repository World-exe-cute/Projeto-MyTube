import "./VideoSearch.css";
import { useState, useRef, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { authThunk } from "../../slices/authSlice";
import FeedBorderVideos from "../../components/VideoPlayer/FeedBorderVideos";
import { Channel } from "../../App";
import ObserverEffect from "../../utils/ObserverEffect";

export default function VideoSearch({}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchVideos, setSearchVideos] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoHash, setVideoHash] = useState([]);
  const { load } = useContext(Channel);
  const observerRef = useRef();
  const allVideoNum = useRef(0);
  const widthCollum = useRef(false);

  useEffect(() => {
    search();

    const percentUp = setInterval(() => {
      load.setLoad((e) => {
        if (load.load === 100) {
          clearInterval(percentUp);
        } else if (e >= 80) {
          return 80;
        }
        return e + 1;
      });
    }, 5);
  }, []);

  const search = async () => {
    setLoading(true);
    const formData = {};
    const infoData = {};

    formData.frontHash = videoHash;
    infoData.fetch = `/home/search/${encodeURIComponent(id)}`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setSearchVideos((e) => [...e, ...res.payload.videos]);
      setVideoHash((e) => [...e, ...res.payload.hash]);
      load.setLoad(100);
      if (res.payload.lock) {
        setCancelObserver(true);
      }
    } else if (res.payload?.success === false) {
      setSearchVideos(res.payload.videos);
      load.setLoad(100);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
    setLoading(false);
  };

  ObserverEffect({
    fetchInfo: searchVideos,
    fetchFunc: search,
    blockRef: observerRef,
    cancelRef: cancelObserver,
    fetchNumRef: allVideoNum,
  });
  return (
    <div ref={widthCollum} id="video-search">
      {searchVideos.length !== 0
        ? searchVideos.map((item, i) => (
            <FeedBorderVideos
              key={i}
              refInfo={searchVideos.length - 1 === i ? observerRef : null}
              videos={item}
              css="search"
              boxWidth={widthCollum.current?.clientWidth}
            />
          ))
        : !loading && (
            <div className="empty-box">
              <div>Tags ou videos não encontrados</div>
              <NavLink to="/">Voltar para o Inicio</NavLink>
            </div>
          )}
    </div>
  );
}
