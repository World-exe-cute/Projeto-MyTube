import "./ErrorMessage.css";

export default function ErrorMessage({ err, text }) {
  let error;

  if (err) {
    error = "error";
  } else {
    error = "";
  }

  return (
    <div className={`message-error ${error}`} aria-label="Mensagem de erro">
      <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      <div id={`error-${text}`} role="alert">
        {err}
      </div>
    </div>
  );
}
