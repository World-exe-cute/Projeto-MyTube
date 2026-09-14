import { useState, useRef, useEffect } from "react";

import "./DescriptionBar.css";
import Linkify from "linkify-react";

export default function DescriptionBar({ options }) {
  const [moreDescription, setMoreDescription] = useState(false);
  const [containerHeight, setContainerHeight] = useState(false);
  const descriptionBar = useRef();

  useEffect(() => {
    if (descriptionBar.current) {
      setContainerHeight(
        descriptionBar.current.offsetHeight >= 110 ? true : false,
      );
    }
  }, []);

  return (
    <div
      ref={descriptionBar}
      tabIndex="-1"
      className="descriptionBar"
      onClick={() => {
        setMoreDescription(true);
        descriptionBar.current.focus();
      }}
      onBlur={() => {
        setMoreDescription(false);
        descriptionBar.current.blur();
      }}
    >
      <div>
        <div className="views">{`${options.view} visualizaçoes`}</div>
        <div className="postData">{options.createdAt}</div>
      </div>
      <div className={`description ${moreDescription ? "show-more" : ""}`}>
        <Linkify>{options.description}</Linkify>
      </div>
      {containerHeight && (
        <div className="moreDescription">
          {moreDescription ? "" : "...mais"}
        </div>
      )}
    </div>
  );
}
