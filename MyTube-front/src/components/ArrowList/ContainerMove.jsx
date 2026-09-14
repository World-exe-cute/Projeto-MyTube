import { useEffect, useRef, useState, useContext } from "react";
import "./ContainerMove.css";
import { ArrowMoveLeft, ArrowMoveRight } from "./ArrowListComponents/Arrows";
import { Channel } from "../../App";

export default function ContainerMove(num) {
  const { tagInfo, tokenInfo } = useContext(Channel);
  const divRef = useRef(null);
  const refs = useRef(null);
  const [count, setCount] = useState(1);
  const [pixels, setPixels] = useState(0);
  const standart = useRef([
    "mundo",
    "animais",
    "oceano",
    "arvores",
    "adult",
    "gato",
    "cachorro",
    "passaros",
    "comida",
    "esportes",
    "montanhas",
    "rios",
    "flores",
    "deserto",
    "estradas",
    "pessoas",
    "cachoeira",
  ]);

  useEffect(() => {
    if (refs.current) {
      const getChildWidth = refs.current.getBoundingClientRect().width;
      const getFatherWidth = divRef.current.getBoundingClientRect().width;

      setPixels((getFatherWidth - getChildWidth) / 3.6); //ajustar
    }
  }, [tagInfo.tagInfo]);

  return (
    <div ref={divRef} className="main-prev">
      <ArrowMoveLeft
        childRef={refs}
        count={{
          count: count,
          setCount: setCount,
        }}
        pxState={pixels}
      />
      <ArrowMoveRight
        childRef={refs}
        count={{
          count: count,
          setCount: setCount,
        }}
        pxState={pixels}
      />
      <nav
        ref={refs}
        id="prev-content"
        style={{ left: num + "rem" }}
        aria-label="Tags de navegação"
      >
        <div
          className={
            tokenInfo.viewMode === "dark" ? "prev-all-dark" : "prev-all-white"
          }
          onClick={() => {
            tagInfo.setTagInfo(tokenInfo ? tokenInfo.tags : standart.current);
          }}
        >
          Tudo
        </div>
        {tagInfo.tagInfo.map((v, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                tagInfo.setTagInfo((e) => {
                  if (String(e) !== String(v)) {
                    let newTag = e.includes(v)
                      ? e.filter((tag) => tag !== v)
                      : e.slice(0, -1);

                    return [v, ...newTag];
                  }
                  return;
                });
              }}
            >
              {v}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
