import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";
import "./ChannelVideos.css";
import { Channel } from "../../../../App";
import { NavContext } from "../ChannelNav";

//scripts
import ChannelSquareBox from "../../../../components/Channel/ChannelSquareBox";
import ShowVideoBox from "../../../../components/Channel/ShowVideoBox";
import VideoInfoCollum from "../../../../components/Channel/VideoInfoCollum";
import ObserverEffect from "../../../../utils/ObserverEffect";

export default function ChannelVideos({}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { showOption } = useContext(Channel);
  const { activeDelete, setActiveDelete } = useContext(NavContext);
  const [videos, setVideos] = useState([]);
  const [allHash, setAllHash] = useState([]);
  const [order, setOrder] = useState(true);
  const [videoHash, setVideoHash] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    checkVideos();
  }, []);

  const checkVideos = async () => {
    const formData = {};
    const infoData = {};

    formData.order = order;
    formData.frontHash = videoHash;
    if (id) {
      infoData.fetch = `/videos/getSearchVideo/${id}`;
    } else {
      infoData.fetch = `/videos/getVideo`;
    }
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const hash = res.payload.videoHash;

      setVideoHash((e) => [...e, ...res.payload.hash]);
      setAllHash(hash.map((e) => e.videoUrl.hash));
      if (res.payload.lock) {
        setCancelObserver(true);
      }

      setVideos((e) => [...e, ...res.payload.videoHash]);
    } else {
      const parse = res.payload;
      console.log(parse[0].msg);
    }
  };

  ObserverEffect({
    fetchInfo: videos,
    fetchFunc: checkVideos,
    blockRef: observerRef,
    cancelRef: cancelObserver,
  });

  return (
    <div id="channel-videos">
      <div className="grid-container">
        <div className="user-video">
          <div>
            <div className="video-mark">
              <ChannelSquareBox
                checkFunction={setActiveDelete}
                activeDel={activeDelete}
                checkAll={allHash}
              />

              <p>Marcar todos</p>
            </div>
          </div>

          {videos.length !== 0 && (
            <>
              {videos.map((item, i) => (
                <div key={i} ref={videos.length - 1 === i ? observerRef : null}>
                  <ShowVideoBox
                    videos={item}
                    setCheck={setActiveDelete}
                    activeDel={activeDelete}
                    keyNum={i}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="user-video-info">
          <div>
            <VideoInfoCollum collum={true} />
            <VideoInfoCollum collum={false} videos={videos} />
          </div>
        </div>
      </div>
      {videos.length === 0 && (
        <div className="last-div">
          <p>*Nenhum conteúdo disponível*</p>
          <button
            onClick={() => {
              showOption("show");
            }}
          >
            Enviar vídeos
          </button>
        </div>
      )}
    </div>
  );
}
