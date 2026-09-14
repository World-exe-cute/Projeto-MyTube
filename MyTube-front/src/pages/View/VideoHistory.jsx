import HomeBar from "../../components/HomeBar/HomeBar";
import "./VideoHistory.css";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { useState, useEffect, useRef } from "react";
import FeedBorderVideos from "../../components/VideoPlayer/FeedBorderVideos";
import ObserverEffect from "../../utils/ObserverEffect";

export default function VideoHistory() {
  const dispatch = useDispatch();
  const [videoHistory, setVideoHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyHash, setHistoryHash] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const observerRef = useRef();
  const allHistoryNum = useRef(0);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async (search = "false") => {
    const formData = {};
    const infoData = {};

    formData.frontHash = historyHash;
    infoData.fetch = `/users/getHistory/${search}`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      if (search !== "false") {
        setVideoHistory([...res.payload.history]);
        setHistoryHash([...res.payload.hash]);
      } else {
        setVideoHistory((e) => [...e, ...res.payload.history]);
        setHistoryHash((e) => [...e, ...res.payload.hash]);
      }
      if (res.payload.lock) {
        setCancelObserver(true);
      }
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  const deleteHistory = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/users/deleteHistory`;
    infoData.path = "DELETE";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setVideoHistory([]);
      setHistoryHash([]);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: videoHistory,
    fetchFunc: getHistory,
    blockRef: observerRef,
    cancelRef: cancelObserver,
    fetchNumRef: allHistoryNum,
  });

  return (
    <div id="video-history">
      <div className="collum-1">
        <h2>Histórico de exibição</h2>
        {videoHistory &&
          videoHistory.map((item, i) => (
            <FeedBorderVideos
              key={i}
              index={i}
              videos={item}
              refInfo={videoHistory.length - 1 === i ? observerRef : null}
            />
          ))}
      </div>
      <div className="collum-2">
        <div>
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="search-box">
            <input
              placeholder="Pesquise no histórico"
              className="search"
              type="text"
              onChange={(e) => {
                setHistorySearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getHistory(historySearch !== "" ? historySearch : "false");
                }
              }}
            />
          </div>
        </div>
        <div
          onClick={() => {
            deleteHistory();
          }}
        >
          <i className="fa-solid fa-trash-can"></i>
          <div>Limpar todo o histórico de exibição</div>
        </div>
      </div>
    </div>
  );
}
