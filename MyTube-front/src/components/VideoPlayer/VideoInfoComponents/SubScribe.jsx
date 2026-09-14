import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import "./SubScribe.css";

export default function SubScribe({ userInscription, userTag }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scribeRef = useRef();
  const [scribe, setScribe] = useState(userInscription);
  const [boolean, setBoolean] = useState(false);

  useEffect(() => {
    if (boolean && scribeRef.current) {
      scribeRef.current.classList.add("check");
    } else if (scribeRef.current) {
      scribeRef.current.classList.remove("check");
    }
  }, [boolean]);

  const subScribe = async () => {
    const formData = {};
    const infoData = {};

    formData.videoHash = userTag;
    infoData.fetch = "/videos/subScribe";
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setScribe(true);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  const cancelSubScribe = async () => {
    const formData = {};
    const infoData = {};

    formData.videoHash = userTag;
    infoData.fetch = "/videos/cancelSubScribe";
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setScribe(false);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <>
      {scribe === true && (
        <div
          ref={scribeRef}
          className="scribe"
          onBlur={() => {
            setBoolean(false);
          }}
          tabIndex={0}
        >
          <div
            onClick={() => {
              if (!boolean) {
                setBoolean(true);
              } else {
                setBoolean(false);
              }
            }}
          >
            <i className="fa-solid fa-bell"></i>
            <div>Inscrito</div>
            <i className="fa-solid fa-angle-down"></i>
          </div>
          <div
            className="sub-more-options"
            onClick={() => {
              cancelSubScribe();
            }}
          >
            <div>Desinscrever</div>
            <i className="fa-solid fa-x"></i>
          </div>
        </div>
      )}
      {scribe === false && (
        <div className="subScribe">
          <div
            onClick={() => {
              subScribe();
            }}
          >
            Inscrever-se
          </div>
        </div>
      )}
      {scribe === undefined && (
        <div className="subScribe">
          <div
            onClick={() => {
              navigate("/login");
            }}
          >
            Inscrever-se
          </div>
        </div>
      )}
    </>
  );
}
