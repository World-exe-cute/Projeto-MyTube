import { useRef } from "react";
import "./CommunityBoxHidden.css";

export default function CommunityBoxHidden({
  buttonText,
  hiddenTitle,
  hiddenOptions,
}) {
  const hiddenBox = useRef(null);
  const showHidden = (active) => {
    if (active) {
      hiddenBox.current.classList.add("show");
    } else {
      hiddenBox.current.classList.remove("show");
    }
  };
  return (
    <button
      className="buttonCommunity"
      onClick={() => {
        showHidden(true);
      }}
      onBlur={() => {
        showHidden(false);
      }}
    >
      <div>{buttonText}</div>
      <i className="fa-solid fa-chevron-down"></i>
      <div ref={hiddenBox} className="box-hidden">
        <div>
          <p>{hiddenTitle}</p>
          <i
            className="fa-solid fa-x"
            onClick={(e) => {
              e.stopPropagation();
              showHidden(false);
            }}
          ></i>
        </div>
        <div className="mid-box">
          <div>
            <div className="circle-box">
              <div></div>
            </div>
            <p>{hiddenOptions[0]}</p>
          </div>
          <div>
            <div className="circle-box">
              <div></div>
            </div>
            <p>{hiddenOptions[1]}</p>
          </div>
        </div>
        <div>
          <div>Aplicar</div>
        </div>
      </div>
    </button>
  );
}
