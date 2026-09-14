import "./CheckCircle.css";

export function CheckCircle({ active }) {
  return (
    <>
      <div className="circle-box">
        <div className="line" aria-hidden="true"></div>
        <div className={`circle ${active === "active" ? "active" : ""}`}></div>
      </div>
    </>
  );
}
