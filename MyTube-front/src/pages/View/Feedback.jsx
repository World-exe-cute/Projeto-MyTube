import "./Feedback.css";
import { useState, useEffect, useContext, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { Channel } from "../../App";

export default function Feedback() {
  const dispatch = useDispatch();
  const { load } = useContext(Channel);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [feedback, setFeedback] = useState("");
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const endLoad = useRef(false);

  useEffect(() => {
    if (!loading) return;

    const percentUp = setInterval(() => {
      load.setLoad((e) => {
        if (endLoad.current) {
          clearInterval(percentUp);
          endLoad.current = false;
          return 100;
        } else if (e === 80) {
          return e;
        } else {
          return e + 1;
        }
      });
    }, 20);
  }, [loading]);

  const sendFeedback = async () => {
    const formData = {};
    const infoData = {};
    setLoading(true);

    formData.captchaToken = await executeRecaptcha("register_email");
    formData.feedbackInfo = feedback;
    infoData.fetch = `/home/sendFeedback`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));
    endLoad.current = true;
    setLoading(false);
    if (res.payload?.success === true) {
      setEnd(true);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div id="feedback-container">
      {end ? (
        <h2>Obrigado pelo FeedBack</h2>
      ) : (
        <form>
          <h2>Envie um feedback para Rodrigo</h2>
          <textarea
            maxLength={5000}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
          />
          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              sendFeedback();
            }}
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
