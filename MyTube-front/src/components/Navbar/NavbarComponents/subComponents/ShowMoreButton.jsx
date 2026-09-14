import "./ShowMoreButton.css";
import { useState } from "react";

export default function ShowMoreButton({ count, funcCount }) {
  const [clickSubs, setClickSubs] = useState(false);
  return (
    <>
      {count > 7 && (
        <>
          {!clickSubs ? (
            <div
              className="show-more-button"
              onClick={() => {
                funcCount(count);
                setClickSubs(true);
              }}
            >
              <h2>Mostrar mais</h2>
              <i class="fa-solid fa-angle-down"></i>
            </div>
          ) : (
            <div
              className="show-more-button"
              onClick={() => {
                funcCount(7);
                setClickSubs(false);
              }}
            >
              <h2>Mostrar menos</h2>
              <i class="fa-solid fa-angle-up"></i>
            </div>
          )}
        </>
      )}
    </>
  );
}
