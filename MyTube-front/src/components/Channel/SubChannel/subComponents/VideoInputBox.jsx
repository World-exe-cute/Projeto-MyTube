import ErrorMessage from "../../../Auth/subAuth/ErrorMessage";
import "./VideoInputBox.css";

export default function VideoInputBox({
  placeholder,
  state,
  field,
  value,
  errInfo,
}) {
  return (
    <>
      <input
        type="text"
        className="video-input"
        value={value ? value : ""}
        placeholder={placeholder}
        onChange={(e) => {
          state.setData({ ...state.data, [field]: e.target.value });
        }}
      />
      <ErrorMessage err={errInfo.err} text={errInfo.text} />
    </>
  );
}
