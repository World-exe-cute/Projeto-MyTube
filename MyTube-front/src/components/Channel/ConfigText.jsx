import { useRef } from "react";
import "./ConfigText.css";

export default function ConfigText({
  title,
  subTitle,
  example,
  valuesChanged,
  valueKey,
  values,
  error,
}) {
  const inputText = useRef();
  const sendText = (e) => {
    valuesChanged((value) => ({ ...value, [valueKey]: e.target.value }));
  };

  return (
    <section id="config-text">
      <h2>{title}</h2>
      <p>{subTitle}</p>
      <input
        ref={inputText}
        type="text"
        value={values ? values : ""}
        onChange={(e) => {
          sendText(e);
        }}
      />
      <div className={`hidden-error ${error !== "" ? "error" : ""}`}>
        {error}
      </div>
      <div className="example">{example}</div>
    </section>
  );
}
