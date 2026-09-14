import "./VideoCheckBox.css";

export default function VideoCheckBox({ title, state, field, value }) {
  return (
    <div className="check-box">
      <h2>{title}</h2>
      <input
        type="checkbox"
        checked={value ? true : false}
        onChange={(e) => {
          state.setData({ ...state.data, [field]: e.target.checked });
        }}
      />
    </div>
  );
}
