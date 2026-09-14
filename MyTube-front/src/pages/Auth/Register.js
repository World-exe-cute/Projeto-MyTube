import "./LoginTest.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

//hooks
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

//Redux
import { authThunk, reset } from "../../slices/authSlice";
import Description from "../../components/Auth/Description";
import {
  InputAuthText,
  InputAuthNumber,
  InputAuthButton,
} from "../../components/Auth/InputAuth";
import OptionButton from "../../components/Auth/OptionButton";
import MoreInfo from "../../components/Auth/MoreInfo";

const Register = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useDispatch();

  const inputRefs = useRef({});
  const formRefs = useRef({});
  const [persona, setPersona] = useState(false);
  const [step, setStep] = useState(1);

  const initialData = {
    name: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    selectGen: "",
    gen: "",
    optGen: "",
    email: "",
    confirmCode: "",
    password: "",
    confirmPassword: "",
    step: "",
  };

  const [data, setData] = useState(initialData);
  const [formError, setFormError] = useState(initialData);

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
    const infoData = {};
    const formData = {};
    let num = step;
    switch (e) {
      case "name":
        formData.name = data.name;
        formData.lastName = data.lastName;
        formData.step = "name";
        num = 2;
        break;
      case "data":
        formData.day = data.day;
        formData.month = data.month;
        formData.year = data.year;
        formData.selectGen = data.selectGen;

        if (formData.selectGen === "Personalizar") {
          formData.gen = data.gen;
          formData.optGen = data.optGen;
        }
        formData.step = "day";
        num = 3;
        break;
      case "email":
        formData.captchaToken = await executeRecaptcha("register_email");
        formData.email = data.email;
        formData.step = "email";
        num = 4;
        break;
      case "confirmCode":
        formData.confirmCode = data.confirmCode;
        formData.step = "confirmCode";
        num = 5;
        break;
      case "password":
        formData.captchaToken = await executeRecaptcha("register_pass");
        formData.password = data.password;
        formData.confirmPassword = data.confirmPassword;
        formData.step = "password";
        num = 6;
        break;
    }
    infoData.fetch = "/users/register";
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData })); //register
    if (res.payload?.success === true) {
      if (num === 6) {
        window.location.href = "/MyTube";
      } else {
        setStep(num);
      }
    } else {
      const parse = res.payload;
      if (Array.isArray(parse.errors)) {
        const newParse = parse.errors.reduce((container, value) => {
          container[value.path] = value.msg;
          return container;
        }, {});
        setFormError({ ...initialData, ...newParse });
      }
    }
  };

  const setRefs = (ref, formRefs) => (el) => {
    if (el) formRefs.current[ref] = el;
  };

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="row" className="resetBackground">
      <div></div>
      <div className="center">
        {step === 1 && (
          <div className="center-block">
            <div>
              <Description
                title="Criar uma conta do MyTube"
                text="Insira seu nome"
              />
              <form
                ref={setRefs("name", formRefs)}
                key={"name"}
                className="login-block"
                aria-label="Area do nome"
              >
                <div>
                  <InputAuthText
                    text="Nome"
                    err={formError.name}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="name"
                    inputRef={inputRefs}
                    formRef={[formRefs, "name"]}
                  />

                  <InputAuthText
                    text="Sobrenome(opcional)"
                    err={formError.lastName}
                    num={1}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="lastName"
                    inputRef={inputRefs}
                    formRef={[formRefs, "name"]}
                  />
                </div>
                <OptionButton
                  stepNum={"login"}
                  submitName="name"
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
              <Description
                h1="Informaçoes básicas"
                h2="Digite sua data de nascimento e gênero"
              />

              <form
                ref={setRefs("data", formRefs)}
                key={"data"}
                className="login-block"
                aria-label="Area do nome"
              >
                <div>
                  <div className="in_display">
                    <div>
                      <InputAuthNumber
                        text="Dia"
                        err={formError.day}
                        num={0}
                        maxNum={2}
                        form={{
                          formData: data,
                          setFormData: setData,
                        }}
                        data="day"
                        inputRef={inputRefs}
                        formRef={[formRefs, "data"]}
                      />
                    </div>
                    <div className="hiddenText">
                      <InputAuthButton
                        text="Mês"
                        err={formError.month}
                        num={1}
                        form={{
                          formData: data,
                          setFormData: setData,
                        }}
                        data="month"
                        buttonData="month"
                        inputRef={inputRefs}
                        formRef={[formRefs, "data"]}
                      />
                    </div>
                    <div>
                      <InputAuthNumber
                        text="Ano"
                        err={formError.year}
                        num={2}
                        maxNum={4}
                        form={{
                          formData: data,
                          setFormData: setData,
                        }}
                        data="year"
                        inputRef={inputRefs}
                        formRef={[formRefs, "data"]}
                      />
                    </div>
                  </div>

                  <div className="gen-block">
                    <InputAuthButton
                      text="Gênero"
                      err={formError.selectGen}
                      num={3}
                      form={{
                        formData: data,
                        setFormData: setData,
                      }}
                      data="selectGen"
                      buttonData="gen"
                      inputRef={inputRefs}
                      setPersona={setPersona}
                      formRef={[formRefs, "data"]}
                    />
                  </div>
                  {persona === true && (
                    <div className="perso-block">
                      <div>
                        <InputAuthText
                          text="Qual o seu Gênero"
                          err={formError.gen}
                          num={4}
                          form={{
                            formData: data,
                            setFormData: setData,
                          }}
                          data="gen"
                          inputRef={inputRefs}
                          formRef={[formRefs, "data"]}
                        />
                      </div>
                      <div>
                        <InputAuthButton
                          text="Refira-se a mim como"
                          err={formError.optGen}
                          num={5}
                          form={{
                            formData: data,
                            setFormData: setData,
                          }}
                          data="optGen"
                          buttonData="newGen"
                          inputRef={inputRefs}
                          formRef={[formRefs, "data"]}
                          //setPersona={setPersona}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <OptionButton
                  stepNum={1}
                  submitName="data"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                />
              </form>
            </div>
            <MoreInfo />
          </div>
        )}

        {step === 3 && (
          <div className="center-block">
            <div>
              <Description
                h1="Usar seu E-mail atual"
                h2="Digite seu endereço de e-mail que voce deseja usar na sua conta mytube"
              />

              <div className="login-block">
                <div>
                  <InputAuthText
                    text="Endereço de e-mail"
                    err={formError.email}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="email"
                    inputRef={inputRefs}
                    formRef={formRefs}
                  />
                  <h3>Será necessario confirmar que esse e-mail é seu</h3>
                </div>
                <OptionButton
                  stepNum={2}
                  submitName="email"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                  formRef={formRefs}
                />
              </div>
            </div>
            <MoreInfo />
          </div>
        )}

        {step === 4 && (
          <div className="center-block">
            <div>
              <Description h1="Confirme seu endereço de e-mail" h2="" />

              <div className="login-block">
                <div>
                  <h2>
                    Digite o código que enviei para
                    <br />
                    {data.email}.
                    <br />
                    Confira sua Caixa de spam
                    <br />
                    se não encontrar o e-mail.
                  </h2>
                  <InputAuthText
                    text="Inserir código"
                    err={formError.confirmCode}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="confirmCode"
                    inputRef={inputRefs}
                    formRef={formRefs}
                  />
                </div>
                <OptionButton
                  stepNum={3}
                  submitName="confirmCode"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                  formRef={formRefs}
                />
              </div>
            </div>
            <MoreInfo />
          </div>
        )}
        {step === 5 && (
          <div className="center-block">
            <div>
              <Description
                h1="Ultima etapa para a criaçao da conta"
                h2="Escreva uma senha"
              />

              <div className="login-block">
                <div>
                  <InputAuthText
                    text="Senha"
                    err={formError.password}
                    num={0}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="password"
                    inputRef={inputRefs}
                    formRef={formRefs}
                    hidden={true}
                  />
                  <InputAuthText
                    text="Confirme a senha"
                    err={formError.confirmPassword}
                    num={1}
                    form={{
                      formData: data,
                      setFormData: setData,
                    }}
                    data="confirmPassword"
                    inputRef={inputRefs}
                    formRef={formRefs}
                    hidden={true}
                  />
                </div>
                <OptionButton
                  stepNum={3}
                  submitName="password"
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                  inputRefs={inputRefs}
                  formRef={formRefs}
                />
              </div>
            </div>
            <MoreInfo />
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Register;
