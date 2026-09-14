import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./ArrowMove.css";
import { NewRefs } from "../scripts/GetRefs";

export const ContainerMove = (num) => {
  const divRef = useRef(null);
  const [newTag, setNewTag] = useState([]);
  const [refs, setRefs] = NewRefs();
  const [resize, setResize] = useState(window.innerWidth);
  const [numClick, setNumClick] = useState(-2);
  const [attTag, setAttTag] = useState([
    "Tudo",
    "Jogos",
    "Musica",
    "Mixes",
    "Noticias",
    "PodCasts",
    "Satira",
    "Valorant",
    "Quadrinhos",
    "J-pop",
    "Ao vivo",
    "League of Legends",
    "new prev",
    "new prev2",
    "new prev3",
    "new prev4",
    "new prev5",
  ]);

  useEffect(() => {
    const handleResize = () => {
      setResize(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const tagsNum = attTag.length;
      const newTags = [];
      let countWidthTag = 0;
      let divWidth = 0;

      if (divRef.current) {
        const getWidth = divRef.current.getBoundingClientRect().width;
        divWidth += getWidth - 110;
      }
      for (let x = 0; x < tagsNum; x++) {
        const getWidth = getLetterWidth(attTag[x]);
        if (countWidthTag < divWidth) {
          countWidthTag += getWidth + 36;
          //console.log("Contagem:: " + countWidthTag);
          newTags.push(attTag[x]);
        } else {
          break;
        }
      }
      setNewTag(newTags);
    }, 0);
  }, [resize, attTag]);

  return (
    <div ref={divRef} className="main-prev">
      <ArrowMove
        tokenRef={refs}
        id="arrow-left"
        css="fa-solid fa-chevron-left"
        num={newTag}
        setNum={{
          numClick: numClick,
          setNumClick: setNumClick,
        }}
        tagArray={setNewTag}
      />
      <ArrowMove
        tokenRef={refs}
        id="arrow-right"
        css="fa-solid fa-chevron-right"
        num={newTag}
        setNum={{
          numClick: numClick,
          setNumClick: setNumClick,
        }}
        tagArray={setNewTag}
      />
      <div
        ref={setRefs("prevContent")}
        id="prev-content"
        style={{ left: num + "rem" }}
      >
        {newTag.map((v, i) => {
          if (newTag[0] === v) {
            if (newTag[0] === "Tudo") {
              return (
                <div ref={setRefs("leftBlock")} className="prev-all" key={i}>
                  {v}
                </div>
              );
            } else {
              return (
                <div ref={setRefs("leftBlock")} key={i}>
                  {v}
                </div>
              );
            }
          } else if (newTag[newTag.length - 1] === v) {
            return (
              <div ref={setRefs("rightBlock")} key={i}>
                {v}
              </div>
            );
          } else {
            return <div key={i}>{v}</div>;
          }
        })}
      </div>
    </div>
  );
};

function ArrowMove({ tokenRef, id, css, num, setNum, tagArray }) {
  let token;
  useEffect(() => {
    token = tokenRef.current["prevContent"];
  });

  return (
    <div
      id={id}
      tabIndex="0"
      onClick={() => {
        switch (id) {
          case "arrow-left":
            if (num) {
              setTimeout(() => {
                const boxWidth = getLetterWidth(num[num.length - 1]);
                const countWidth = setNum.numClick + (boxWidth + 36);
                setNum.setNumClick(countWidth);
                token.style.left = `${countWidth}px`;
                attTags(num[0], "left", tagArray);
              }, 10);
            }
            break;
          case "arrow-right":
            if (num) {
              setTimeout(() => {
                const boxWidth = getLetterWidth(num[0]);
                const countWidth = -boxWidth - 36 + setNum.numClick;
                setNum.setNumClick(countWidth);
                token.style.left = `${countWidth}px`;
                attTags(num[num.length - 1], "right", tagArray);
              }, 10);
            }
            break;
        }
      }}
    >
      <i className={css}></i>
    </div>
  );
}

const getLetterWidth = (text, css = "16px Roboto") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = css;
  const width = context.measureText(text).width;
  return width;
};

const attTags = (key, arrow, tagArray) => {
  tagArray((e) => e.filter((_, id) => id !== key));

  if (arrow === "left") {
    tagArray((e) => [...e, key]);
    tagArray((e) => e.slice(1));
  } else if (arrow === "right") {
    tagArray((e) => [key, ...e]);
    tagArray((e) => e.slice(0, -1));
  }
};
