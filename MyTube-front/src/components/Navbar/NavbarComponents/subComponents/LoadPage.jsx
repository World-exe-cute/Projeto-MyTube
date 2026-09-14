import "./LoadPage.css";
import { useRef, useEffect, useContext } from "react";
import { Channel } from "../../../../App";

export default function LoadPage({}) {
  const { load } = useContext(Channel);
  const bar = useRef();
  useEffect(() => {
    if (load.load === 100) {
      setTimeout(() => {
        load.setLoad(0);
      }, 100);
    }
  }, [load.load]);

  return (
    <div
      ref={bar}
      id="load-bar"
      style={{
        width: `${load.load}%`,
        visibility: load.load > 0 ? "visible" : "hidden",
      }}
    >
      <div className="load"></div>
    </div>
  );
}
