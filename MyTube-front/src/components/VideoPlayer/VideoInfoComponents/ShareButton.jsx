import "./ShareButton.css";
import { useState } from "react";

export default function ShareButton({}) {
  const [copy, setCopy] = useState();
  const url = window.location.href;

  const clipboard = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div
      onClick={() => {
        clipboard();
        setCopy(true);
        setTimeout(() => {
          setCopy(false);
        }, 1000);
      }}
      className={`share-button ${copy ? "active" : ""}`}
    >
      <div>
        <i className="fa-solid fa-share"></i>
      </div>
      <div>Compartilhar</div>
    </div>
  );
}
