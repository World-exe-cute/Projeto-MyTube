import { Link, NavLink } from "react-router-dom";
import "./OptionButton.css";

export default function OptionButton({
  stepNum,
  submitName,
  setStep,
  handleSubmit,
  inputRefs,
}) {
  return (
    <div className="options-button">
      {typeof stepNum === "string" ? (
        <>
          {stepNum === "login" ? (
            <NavLink to="/login">Login</NavLink>
          ) : (
            <NavLink to="/register">Registrar</NavLink>
          )}
        </>
      ) : (
        <Link
          onClick={() => {
            setStep(stepNum);
            inputRefs.current = {};
          }}
        >
          Voltar
        </Link>
      )}
      <button
        type="submit"
        className="active-a"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(submitName);
          inputRefs.current = {};
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(submitName);
            inputRefs.current = {};
          }
        }}
      >
        Próxima
      </button>
    </div>
  );
}
