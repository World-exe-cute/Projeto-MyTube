import "./ConfigTextBox.css";
import { useEffect, useRef, useState } from "react";

export default function ConfigTextBox({
  title,
  placeholder,
  valuesChanged,
  valueKey,
  values,
  error,
}) {
  const inputTextBox = useRef();
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    setTextValue(values);
  }, [values]);

  const sendText = (e) => {
    valuesChanged((value) => ({ ...value, [valueKey]: e.target.value }));
  };
  return (
    <section id="config-text-box">
      <h2>{title}</h2>
      <textarea
        type="text"
        ref={inputTextBox}
        placeholder={placeholder}
        onChange={(e) => {
          setTextValue((value) => value + e.target.value.slice(-1));
          sendText(e);
        }}
        defaultValue={textValue}
      ></textarea>
      <div className={`hidden-error ${error !== "" ? "error" : ""}`}>
        {error}
      </div>
    </section>
  );
}
