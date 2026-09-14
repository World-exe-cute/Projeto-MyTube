import "./LoginTest.css";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { InputAuthText } from "../../components/Auth/InputAuth";
import Description from "../../components/Auth/Description";
import OptionButton from "../../components/Auth/OptionButton";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import MoreInfo from "../../components/Auth/MoreInfo";

const Login = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useDispatch();
  const inputRefs = useRef({});
  const formRefs = useRef({});
  const initialData = {
    email: "",
    password: "",
    step: "",
  };
  const [data, setData] = useState(initialData);
  const [formError, setFormError] = useState(initialData);
  const [step, setStep] = useState(1);

  const setRefs = (ref, formRefs) => (el) => {
    if (el) formRefs.current[ref] = el;
  };

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.documentElement.style.display = "flex";
    document.documentElement.style.justifyContent = "center";
    document.documentElement.style.alignItems = "center";

    return () => {
      document.documentElement.style.height = "";
      document.documentElement.style.display = "";
      document.documentElement.style.justifyContent = "";
      document.documentElement.style.alignItems = "";
    };
  });

  const handleSubmit = async (e) => {
    const formData = {};
    const infoData = {};
    let num = step;
    switch (e) {
      case "email":
        formData.email = data.email;
        formData.step = "email";
        num = 2;
        break;
      case "password":
        formData.captchaToken = await executeRecaptcha("login");
        formData.password = data.password;
        formData.step = "password";
        num = 3;
        break;
    }

    infoData.fetch = "/users/login";
    infoData.path = "POST";
    const res = await dispatch(authThunk({ formData, infoData })); //register
    if (res.payload?.success === true) {
      if (num === 3) {
        window.location.href = "/MyTube";
      } else {
        setStep(num);
      }
    } else {
      const parse = res.payload;
      console.log(parse);

      setFormError({
        ...initialData,
        [parse.errors[0].path]: parse.errors[0].msg,
      });
    }
  };

  return (
    <div id="row" className="resetBackground">
      <div></div>
      <div className="center">
        {step === 1 && (
          <div className="center-block">
            <div>
              <Description
                title="Fazer login"
                text="Esta é apenas uma conta teste,
                  e sera apagada do banco de dados apos 30 dias."
              />

              <form
                ref={setRefs("email", formRefs)}
                key={"email"}
                className="login-block"
                aria-label="Area do email"
              >
                <div>
                  <InputAuthText
                    text="E-mail"
                    err={formError.email}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="email"
                    inputRef={inputRefs}
                    formRef={[formRefs, "email"]}
                  />
                  <div className="grid">
                    <NavLink>Esqueceu seu e-mail?</NavLink>
                  </div>
                  <p>
                    Não está no seu computador? Use o modo visitante para fazer
                    login com privacidade.{" "}
                    <Link>Saiba como usar o modo visitante.</Link>
                  </p>
                </div>
                <OptionButton
                  stepNum={"registrar"}
                  submitName="email"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                />
              </form>
            </div>
            <MoreInfo />
          </div>
        )}

        {step === 2 && (
          <div className="center-block">
            <div>
              <Description title="Olá" text={data.email} />

              <form
                ref={setRefs("password", formRefs)}
                key={"password"}
                className="login-block"
                aria-label="Area da senha"
              >
                <div>
                  <InputAuthText
                    text="Digite sua senha"
                    err={formError.password}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="password"
                    inputRef={inputRefs}
                    formRef={[formRefs, "password"]}
                    hidden={true}
                  />
                </div>
                <OptionButton
                  stepNum={0}
                  submitName="password"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                />
              </form>
            </div>
            <MoreInfo />
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Login;
