import { useState } from "react";

export default function PostsLine({ keyNum, textArray, setText }) {
  const [numText, setNumText] = useState(0);

  const textWrite = (e) => {
    if (e.target.value.length > numText && numText < 65) {
      setText((prev) =>
        prev.map((item, i) => (i === keyNum ? e.target.value : item)),
      );
      setNumText(numText + 1);
    } else if (e.target.value.length < numText && numText > 0) {
      setText((prev) =>
        prev.map((item, i) => (i === keyNum ? e.target.value : item)),
      );
      setNumText(numText - 1);
    }
    /*if (numText > 0) {
      pollInput(true);
    }*/
  };

  const deletePoll = () => {
    setText((prev) => prev.filter((e) => e.key !== textArray.key));
  };

  return (
    <div>
      <div tabIndex="0" className="line-box">
        <i
          class="fa-solid fa-x"
          onClick={() => {
            deletePoll();
          }}
        ></i>
        <input
          type="text"
          onInput={(e) => {
            textWrite(e);
          }}
          value={textArray.text}
        />
      </div>
      <div>{`${numText}/65`}</div>
    </div>
  );
}
