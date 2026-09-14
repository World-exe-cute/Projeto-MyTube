//import react from "react";
import "./OptionHidden.css";

export const OptionHidden = ({ clickChange, css, shadow }) => {
  return (
    <button
      className={css}
      tabIndex="0"
      onClick={() => {
        clickChange(true);
        shadow(true);
      }}
    >
      <i className="fa-solid fa-bars"></i>
    </button>
  );
};

export const OptionHiddenGlobal = ({ varClick, clickChange, css }) => {
  return (
    <>
      {varClick === false && (
        <button
          className={css}
          tabIndex="0"
          onClick={() => {
            clickChange(true);
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}
      {varClick === true && (
        <button
          className={css}
          tabIndex="0"
          onClick={() => {
            clickChange(false);
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}
    </>
  );
};
