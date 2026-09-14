import { useState } from "react";
import "./VideoTextareaBox.css";

export default function VideoTextareaBox({
  title,
  placeholder,
  count = false,
  store,
  field,
  value,
}) {
  const [textCount, setTextCount] = useState(count);
  return (
    <div className="video-textarea">
      <h2>{title}</h2>
      <textarea
        maxLength={count ? count : undefined}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={
          count
            ? (e) => {
                const textLength = e.target.value.length;
                const calcText = count - textLength;
                if (calcText <= count && calcText >= 0) {
                  setTextCount(calcText);
                  store(e.target.value);
                }
              }
            : (e) => {
                store.setData({ ...store.data, [field]: e.target.value });
              }
        }
      ></textarea>
      {count && <div className="count-box">{textCount}</div>}
    </div>
  );
}
