import { useEffect, useRef, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import { Channel } from "../../../App";
import "./OptionBar.css";
import { MoreOptions, OptionsLinks } from "./subComponents/OptionsComponents";
import { CheckCircle } from "./subComponents/CheckCircle";
import { NavLink, useNavigate } from "react-router-dom";
import UserChannel from "../../VideoPlayer/VideoInfoComponents/UserChannel";

const OptionBar = ({ active, style, logged }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewRef = useRef();
  const restrictedRef = useRef();
  const defaultRef = useRef();
  const [step, setStep] = useState("default");
  const [restrict, setRestrict] = useState("desactive");
  const { tokenInfo, viewMode } = useContext(Channel);

  useEffect(() => {
    switch (step) {
      case "default":
        defaultRef.current.focus();
        return;
      case "view":
        viewRef.current.focus();
        return;
      case "restricted":
        restrictedRef.current.focus();
        return;
    }
  }, [step]);

  useEffect(() => {
    setRestrict(tokenInfo.restrictMode);
  }, []);

  const userRestrict = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/users/setRestrict`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      navigate(0);
    } else if (res.payload === "usuario nao autorizado.") {
      navigate("/login");
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  const userViewMode = async (value) => {
    const formData = {};
    const infoData = {};

    formData.value = `${value}`;
    infoData.fetch = `/users/setViewMode`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      viewMode.setDarkMode(res.payload.viewValue);
    } else {
      viewMode.setDarkMode(value);
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <nav
      id="option-bar"
      className={`${active ? "active" : ""}`}
      style={{ right: style + "rem" }}
    >
      {step === "default" && (
        <div ref={defaultRef}>
          {logged && (
            <>
              <section className="user-bar">
                <UserChannel
                  url={tokenInfo.photoUrl.photo?.hash}
                  name={tokenInfo.name[0]}
                />
                <div>
                  <h2>{tokenInfo?.name}</h2>
                  <div aria-label="Tag do usuário">{tokenInfo?.idTag}</div>
                  <NavLink to={`/profile/videos/${tokenInfo?.idTag}`}>
                    Acessar seu canal
                  </NavLink>
                </div>
              </section>
              <div className="Line"></div>
              <OptionsLinks
                text="Sair"
                css="fa-solid fa-door-open"
                link="/exit"
              />
              <div className="Line"></div>
            </>
          )}
          <OptionsLinks
            text="Seus dados no MyTube"
            css="fa-solid fa-user-shield"
            link={logged ? "/myStudio/customize/profile" : "/login"}
          />
          <MoreOptions
            text="Aparência:"
            varText={
              viewMode.darkMode === "white" ? "Tema Claro" : "Tema Escuro"
            }
            css="fa-solid fa-moon"
            next={[setStep, "view"]}
          />
          <MoreOptions
            text="Modo restrito:"
            varText={
              tokenInfo.restrictMode === "desactive" ? "desativado" : "ativado"
            }
            css="fa-solid fa-shield-halved"
            next={[setStep, "restricted"]}
          />
          <div className="Line"></div>
          <OptionsLinks
            text="Configurações"
            css="fa-solid fa-gear"
            link={logged ? "/config" : "/login"}
          />
          <div className="Line"></div>
          <OptionsLinks
            text="Ajuda"
            css="fa-solid fa-question"
            link={logged ? "/help" : "/login"}
          />
          <OptionsLinks
            text="Enviar feedback"
            css="fa-solid fa-exclamation"
            link={logged ? "/feedback" : "/login"}
          />
        </div>
      )}
      {step === "view" && (
        <div ref={viewRef} className="view-box">
          <button
            className="option-bar-title"
            onClick={() => {
              setStep("default");
            }}
          >
            <div aria-hidden="true">
              <i class="fa-solid fa-arrow-left"></i>
            </div>
            <div>Aparência</div>
          </button>
          <p>
            Esta configuração será usada
            <br /> apenas neste navegador
          </p>
          <button
            onClick={() => {
              userViewMode("dark");
            }}
          >
            Tema escuro
          </button>
          <button
            onClick={() => {
              userViewMode("white");
            }}
          >
            Tema claro
          </button>
        </div>
      )}
      {step === "restricted" && (
        <div ref={restrictedRef} className="restricted">
          <button
            className="option-bar-title"
            onClick={() => {
              setStep("default");
            }}
          >
            <div aria-hidden="true">
              <i class="fa-solid fa-arrow-left"></i>
            </div>
            <div>Modo restrito</div>
          </button>
          <p>
            Essa opção ajuda a ocultar vídeos que <br />
            possam ter conteúdo para maiores.
            <br />
            Nenhum filtro é 100% preciso.
          </p>
          <p>Esta configuração se aplica apenas a sua conta.</p>
          <button
            onClick={() => {
              userRestrict();
            }}
          >
            <p>ATIVE O MODO RESTRITO</p>

            <CheckCircle active={restrict} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default OptionBar;
