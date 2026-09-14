import "./ImageMove.css";
import { useState, useEffect, useRef } from "react";

export default function ImageMove({ imgUrl }) {
  const refs = useRef([]);
  const [num, setNum] = useState(0);
  const [move, setMove] = useState(false);
  const [moveInfo, setMoveInfo] = useState("center");
  const [lock, setLock] = useState(false);
  const [revoke, setRevoke] = useState([]);

  useEffect(() => {
    moveImage(moveInfo);
  }, [move]);

  useEffect(() => {
    moveImage();
  }, [imgUrl]);

  const moveImage = (direction) => {
    setLock(true);
    const maxLength = imgUrl.length - 1;
    if (revoke[revoke.length - 1] !== 0) {
      setTimeout(() => {
        revoke.map((e) => URL.revokeObjectURL(e));
      }, 5000);
    }
    if (imgUrl.length > 0 && num <= maxLength) {
      const img1 = num - 2 >= 0 ? URL.createObjectURL(imgUrl[num - 2]) : "none";

      const img2 = num - 1 >= 0 ? URL.createObjectURL(imgUrl[num - 1]) : "none";
      const img3 = URL.createObjectURL(imgUrl[num]);
      const img4 =
        num + 1 <= maxLength ? URL.createObjectURL(imgUrl[num + 1]) : "none";
      const img5 =
        num + 2 <= maxLength ? URL.createObjectURL(imgUrl[num + 2]) : "none";
      const imgArray = [img1, img2, img3, img4, img5];
      if (revoke[revoke.length - 1] !== 0) {
        for (let x = 0; x <= 4; x++) {
          if (imgArray[x] !== "none") {
            const img = new Image();
            img.src = imgArray[x];
            img.decode().then(() => {
              setTimeout(() => {
                refs.current[x].style.backgroundImage = `url(${imgArray[x]})`;
              }, 498);
            });
          } else {
            setTimeout(() => {
              refs.current[x].style.backgroundImage = "none";
            }, 498);
          }
        }

        switch (direction) {
          case "left":
            refs.current[2].classList.add("activeLeft");
            refs.current[1].classList.add("active");
            setTimeout(() => {
              refs.current[2].classList.remove("activeLeft");
              refs.current[1].classList.remove("active");
            }, 500);
            break;
          case "right":
            refs.current[2].classList.add("activeRight");
            refs.current[3].classList.add("active");
            setTimeout(() => {
              refs.current[2].classList.remove("activeRight");
              refs.current[3].classList.remove("active");
            }, 500);
            break;
          default:
            break;
        }
      }

      setRevoke([img1, img2, img3, img4, img5]);
    }
    setLock(false);
    setMoveInfo();
  };

  return (
    <div className="image-container">
      <button
        onClick={() => {
          if (num >= 0 && !lock) {
            setNum(num - 1);
            setMoveInfo("left");
            setMove(num - 1);
          }
        }}
        className={`${num <= 0 ? "hidden" : ""}`}
      >
        <i className="fa-solid fa-angle-left"></i>
      </button>
      <div>
        <div
          ref={(e) => (refs.current[0] = e)}
          className="img-left under"
        ></div>
        <div ref={(e) => (refs.current[1] = e)} className="img-left"></div>
        <div ref={(e) => (refs.current[2] = e)} className="img-center"></div>
        <div ref={(e) => (refs.current[3] = e)} className="img-right"></div>
        <div
          ref={(e) => (refs.current[4] = e)}
          className="img-right under"
        ></div>
      </div>

      <button
        onClick={() => {
          if (num <= imgUrl.length - 1 && !lock) {
            setNum(num + 1);
            setMoveInfo("right");
            setMove(num + 1);
          }
        }}
        className={`${num >= imgUrl.length - 1 ? "hidden" : ""}`}
      >
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
}
