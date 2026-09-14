import UserFeedVideos from "../../../components/VideoPlayer/UserFeedVideos";
import "./UserVideos.css";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import { useEffect, useState, useRef, useContext } from "react";
import ObserverEffect from "../../../utils/ObserverEffect";
import { Channel } from "../../../App";

export default function UserVideos({ allVideos }) {
  const { tokenInfo } = useContext(Channel);
  const dispatch = useDispatch();
  const [videoInfo, setVideoInfo] = useState([]);
  const [videoHash, setVideoHash] = useState([]);
  const [order, setOrder] = useState(true);
  const [openOrder, setOpenOrder] = useState(false);
  const [cancelObserver, setCancelObserver] = useState(false);
  const { user } = useParams();
  const observerRef = useRef();
  const allVideoNum = useRef(0);

  useEffect(() => {
    getVideoInfo();
  }, [user, order]);

  const getVideoInfo = async () => {
    const formData = {};
    const infoData = {};

    formData.frontHash = videoHash;
    formData.order = order;
    infoData.fetch = `/users/getUserVideo/${user}`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setVideoHash((e) => [...e, ...res.payload.hash]);
      setVideoInfo((e) => [...e, ...res.payload.videoInfo]);
      if (res.payload.lock) {
        setCancelObserver(true);
      }
      //console.log(res);
    } else if (res.payload === "false") {
      console.log("caiu no false");
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: videoInfo,
    fetchFunc: getVideoInfo,
    blockRef: observerRef,
    cancelRef: cancelObserver,
    fetchNumRef: allVideoNum,
  });
  return (
    <div id="feed-videos">
      <div
        tabIndex={0}
        className="order"
        onClick={() => {
          setOpenOrder(true);
        }}
        onBlur={() => {
          setOpenOrder(false);
        }}
      >
        <i className="fa-solid fa-list"></i>
        <p>Ordernar por</p>
        {openOrder && (
          <div className="order-hidden">
            <div
              onClick={() => {
                if (!order) {
                  setOrder(true);
                  setVideoHash([]);
                  setVideoInfo([]);
                }
              }}
            >
              Data de inclusao(mais recente)
              {order && <i className="fa-solid fa-check"></i>}
            </div>
            <div
              onClick={() => {
                if (order) {
                  setOrder(false);
                  setVideoHash([]);
                  setVideoInfo([]);
                }
              }}
            >
              Ultimo video adicionado
              {!order && <i className="fa-solid fa-check"></i>}
            </div>
          </div>
        )}
      </div>
      <div className="videos-container">
        {videoInfo.length !== 0 ? (
          videoInfo.map((item, i) => (
            <UserFeedVideos
              key={i}
              refInfo={videoInfo.length - 1 === i ? observerRef : null}
              index={i}
              videos={item}
            />
          ))
        ) : (
          <div className="create-video">
            <div>Nenhum video no canal</div>
            {tokenInfo.idTag === user && (
              <Link to="/myStudio/channel/videos">Envie um video</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
