import "./Arrows.css";
import { useRef, useEffect, useState } from "react";

export function ArrowMoveLeft({ childRef, count, pxState }) {
  const arrowLeft = useRef(null);
  const [click, setClick] = useState(true);

  useEffect(() => {
    if (count.count || arrowLeft.current) {
      if (count.count === 1) {
        arrowLeft.current.classList.add("hidden");
      } else {
        arrowLeft.current.classList.remove("hidden");
      }
    }
  }, [count.count]);

  return (
    <div
      ref={arrowLeft}
      id="arrow-left"
      tabIndex="0"
      className="hidden"
      aria-hidden="true"
      onClick={() => {
        if (!click) return;

        setClick(false);

        setTimeout(() => {
          if (count.count >= 2) {
            const divPx = parseInt(childRef.current.style.left || 0, 10);
            const newPixels = divPx - pxState;
            childRef.current.style.left = `${newPixels}px`;
            count.setCount((e) => e - 1);
          }
          setClick(true);
        }, 150);
      }}
    >
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  );
}

export function ArrowMoveRight({ childRef, count, pxState }) {
  const [click, setClick] = useState(true);
  const arrowRight = useRef(null);

  useEffect(() => {
    if (count.count || arrowRight.current) {
      if (count.count === 4) {
        arrowRight.current.classList.add("hidden");
      } else {
        arrowRight.current.classList.remove("hidden");
      }
    }
  }, [count.count]);

  return (
    <div
      ref={arrowRight}
      id="arrow-right"
      tabIndex="0"
      aria-hidden="true"
      onClick={() => {
        if (!click) return;

        setClick(false);

        setTimeout(() => {
          if (count.count <= 4) {
            const divPx = parseInt(childRef.current.style.left || 0, 10);
            const newPixels = divPx + pxState;
            childRef.current.style.left = `${newPixels}px`;
            count.setCount((e) => e + 1);
          }
          setClick(true);
        }, 350);
      }}
    >
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );
}
