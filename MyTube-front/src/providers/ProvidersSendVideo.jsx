import "./ProvidersSendVideo.css";
import { Channel } from "../App";
import { useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventModal from "../scripts/EventModal";
import SendVideoBox from "../components/Channel/SubChannel/SendVideoBox";

export default function ProvidersSendVideo({ videoInfo }) {
  const location = useLocation();
  const inputRef = useRef(null);
  const urlRef = useRef(window.location.pathname.split("/")[3]);

  useEffect(() => {
    urlRef.current = window.location.pathname.split("/")[3];
  }, [location.pathname]);

  const { hiddenContainer, showOption, stepOption, focusOption } =
    useContext(Channel);

  return (
    <div id="modal-video-box">
      {urlRef.current !== "posts" && (
        <>
          <EventModal
            element={[hiddenContainer]}
            input={inputRef}
            focus={focusOption}
            step={stepOption.setStep}
          />

          <div ref={hiddenContainer} tabIndex={0} className="hidden-container">
            <SendVideoBox
              input={inputRef}
              step={stepOption}
              showOption={showOption}
              videoInfo={videoInfo}
            />
          </div>
        </>
      )}
    </div>
  );
}
