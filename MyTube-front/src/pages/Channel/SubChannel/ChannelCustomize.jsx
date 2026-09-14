import { Link } from "react-router-dom";
import "./ChannelCustomize.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Channel } from "../../../App";

//components
import CircleButtons from "../../../components/Channel/SubChannel/CircleButtons";

//scripts
import ObserverBorderBottom from "../../../scripts/ObserverBorderBottom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";

export default function ChannelCustomize({ active, route }) {
  const dispath = useDispatch();
  const { tokenInfo } = useContext(Channel);
  const customOptions = useRef(null);
  const initialData = {
    tv: null,
    pc: null,
    cel: null,
    photo: null,
    name: "",
    identify: "",
    pronouns: "",
    description: "",
    fetch: "",
  };
  const [valuesChanged, setValuesChanged] = useState(initialData);
  const [formError, setFormError] = useState(initialData);
  const [valueRef, setValueRef] = useState(false);
  const newDataRef = useRef(null);
  const path = "http://localhost:3000/myStudio/customize";

  useEffect(() => {
    const newData = {
      tv: tokenInfo?.photoUrl?.tv?.hash || null,
      pc: tokenInfo?.photoUrl?.pc?.hash || null,
      cel: tokenInfo?.photoUrl?.cel?.hash || null,
      photo: tokenInfo?.photoUrl?.photo?.hash || null,
      name: tokenInfo?.name || "",
      identify: tokenInfo?.idTag || "",
      pronouns: tokenInfo?.pronouns || "",
      description: tokenInfo?.description || "",
      fetch: "",
    };
    newDataRef.current = newData;
    setValuesChanged(newData);
  }, [tokenInfo]);

  useEffect(() => {
    if (JSON.stringify(valuesChanged) === JSON.stringify(newDataRef.current)) {
      setValueRef(false);
    } else {
      setValueRef(
        Object.values(valuesChanged).some(
          (key, val) =>
            val !== null &&
            val !== "" &&
            val !== undefined &&
            (!["tv", "pc", "cel", "photo"].includes(key) ||
              val instanceof Blob),
        ),
      );
    }
  }, [valuesChanged]);
  ObserverBorderBottom(customOptions, active);

  const handleSubmit = async (e) => {
    const infoData = {};
    const formData = new FormData();
    const user = Object.fromEntries(
      Object.entries(valuesChanged).filter(
        ([key, value]) => value !== "" && value !== null,
      ),
    );

    Object.entries(user).forEach(([key, value]) => {
      switch (key) {
        case "photo":
          if (value instanceof Blob) {
            formData.append("photo", value, "photo");
          }
          break;
        case "tv":
          if (value instanceof Blob) {
            formData.append("photo", value, "tv");
          }
          break;
        case "pc":
          if (value instanceof Blob) {
            formData.append("photo", value, "pc");
          }
          break;
        case "cel":
          if (value instanceof Blob) {
            formData.append("photo", value, "cel");
          }
          break;
      }
    });

    infoData.fetch = "/users/channelCustom";
    infoData.path = "PATCH";
    infoData.image = true;

    for (let [key, value] of Object.entries(user)) {
      if (key !== "photo" && key !== "tv" && key !== "pc" && key !== "cel") {
        formData.append(key, value);
      }
    }

    const res = await dispath(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      window.location.reload();
    } else {
      let parse;
      try {
        parse = res.payload.errors;
      } catch {
        console.log(res.payload);
        return;
      }

      const newParse = parse.reduce((container, value) => {
        container[value.path] = value.msg;
        return container;
      }, {});
      setFormError({ ...initialData, ...newParse });
    }
  };

  const newRoute = React.cloneElement(route, {
    valuesChanged: setValuesChanged,
    values: valuesChanged,
    formError: formError,
  });

  return (
    <div className="side-bar">
      <div className="customize">
        <div>Personalização do canal</div>
      </div>
      <div ref={customOptions} className="customize-options">
        <div>
          <Link
            className={active === "profile" ? "active" : ""}
            to={`${path}/profile`}
          >
            Perfil
          </Link>
        </div>
        <div>
          <CircleButtons to="/teste" text="Acessar o canal" />
          <div className={`button-box ${valueRef ? "active" : ""}`}>
            <CircleButtons to="/teste" text="Cancelar" css="blur" />
          </div>
          <div
            className={`button-box ${valueRef ? "active" : ""}`}
            onClick={() => {
              handleSubmit();
            }}
          >
            <CircleButtons to="/teste" text="Publicar" css="blur" />
          </div>
        </div>
      </div>
      {newRoute}
    </div>
  );
}
