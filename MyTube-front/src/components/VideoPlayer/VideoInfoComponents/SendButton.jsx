import "./SendButton.css";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function SendButton({
  state,
  setState,
  show,
  hash,
  fetch,
  data,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sendComment = async () => {
    const formData = {};
    const infoData = {};

    formData.hash = hash;
    formData.data = data;
    infoData.fetch = `${fetch}/setComment`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      window.location.reload();
    } else {
      const parse = res.payload;
      console.log(parse);
      if (parse === "usuario nao autorizado.") {
        navigate("/login");
      }
    }
  };
  return (
    <div className="send-container">
      <div
        className="cancel"
        onClick={() => {
          setState("");
          show(false);
        }}
      >
        Cancelar
      </div>
      <div
        className={`send ${state ? "check" : ""}`}
        onClick={() => {
          if (state) {
            sendComment();
          }
        }}
      >
        Enviar
      </div>
    </div>
  );
}
