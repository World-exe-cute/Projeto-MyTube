import "./ShowVideoBox.css";
import ChannelSquareBox from "./ChannelSquareBox";
import { useEffect, useRef, useContext } from "react";
import { Channel } from "../../App";

export default function ShowVideoBox({ videos, setCheck, activeDel, keyNum }) {
  const infoBoxTitle = useRef();
  const { setVideoInfo, stepOption, showOption } = useContext(Channel);

  useEffect(() => {
    const infoBoxWidth = infoBoxTitle.current.offsetWidth;

    document.documentElement.style.setProperty(
      "--info-box-title-width",
      infoBoxWidth,
    );
  }, []);

  return (
    <div
      className="video-box"
      onClick={() => {
        setVideoInfo(videos);
        stepOption.setStep(2);
        showOption("show");
      }}
    >
      <div className="square-container">
        <ChannelSquareBox
          checkFunction={setCheck}
          activeDel={activeDel}
          checkOne={videos.videoUrl.hash}
        />
      </div>
      <div className="thumb-box">
        <img
          src={`http://localhost:5000/api/videos/check-thumb/${videos.videoUrl.hash}`}
        ></img>
      </div>
      <div className="info-box">
        <h2 ref={infoBoxTitle}>{videos.title}</h2>
        <textarea
          readOnly
          placeholder="Adicionar descrição"
          value={videos.description || ""}
        />
      </div>
    </div>
  );
}
