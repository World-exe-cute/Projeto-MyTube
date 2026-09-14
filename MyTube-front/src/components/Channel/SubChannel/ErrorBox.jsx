import "./ErrorBox.css";

export default function ErrorBox({ title, errText, hideFunction, inputRef }) {
  return (
    <>
      <h2>{title}</h2>
      <div>
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>{errText}</p>
      </div>
      <div>
        <button
          className="submit"
          onClick={() => {
            hideFunction("error");
          }}
        >
          Cancelar
        </button>
        <button
          className="submit white"
          onClick={() => {
            hideFunction("error");
            inputRef.current.click();
          }}
        >
          Tentar novamente
        </button>
      </div>
    </>
  );
}
