import "./InputAuth.css";
import { useEffect, useState } from "react";

//components
import ErrorMessage from "./subAuth/ErrorMessage";

const setRefs = (ref, inputRef) => (el) => {
  if (el) inputRef.current[ref] = el;
};

const focus = (ref, inputRef) => {
  inputRef.current[`step-${ref}`]?.focus();
};

function addFocus(inputRefs) {
  const ref = inputRefs.current;

  const refKeys = Object.keys(ref).length;
  const input = document.getElementsByClassName("input-name");

  const blur = (i) => {
    const key = `step-${i}`;
    setTimeout(() => {
      if (
        (ref[key].value === "" && ref[key].tagName === "INPUT") ||
        (ref[key].textContent === "▼" && ref[key].tagName === "BUTTON")
      ) {
        input[i].classList.remove("focus");
      }
      ref[key].classList.remove("input-focus");
    }, 10);
  };

  const focusName = (i) => {
    const key = `step-${i}`;
    if (
      (ref[key].value === "" && ref[key].tagName === "INPUT") ||
      (ref[key].textContent === "▼" && ref[key].tagName === "BUTTON")
    ) {
      input[i].classList.add("focus");
    }
    ref[key].classList.add("input-focus");
  };

  for (let x = 0; x < refKeys; x++) {
    const key = `step-${x}`;
    ref[key].addEventListener("focus", () => focusName(x));
    ref[key].addEventListener("blur", () => blur(x));
    if (ref[key].value) {
      input[x].classList.add("focus");
    }
  }
}

function keyDown(e, formRef, data) {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = Array.from(formRef.current[data]);
    const index = input.indexOf(e.target);

    if (index < input.length - 1) {
      input[index + 1].focus();
    } else {
      formRef.current[data].querySelector("button[type=submit]").click();
    }
  }
}

export function InputAuthText({
  text,
  err,
  num,
  form,
  data,
  inputRef,
  formRef,
  hidden,
}) {
  const [pass, setPass] = useState(true);

  useEffect(() => {
    addFocus(inputRef);
  }, []);

  let error;

  if (err) {
    error = "error";
  } else {
    error = "";
  }

  return (
    <div className="input-auth">
      <div>
        <div className="input-name" onClick={() => focus(num, inputRef)}>
          {text}
        </div>
        <div>
          <input
            type={hidden ? (pass ? "password" : "text") : "text"}
            className={error}
            ref={setRefs(`step-${num}`, inputRef)}
            key={`step-${num}`}
            onChange={(e) =>
              form.setFormData({ ...form.formData, [data]: e.target.value })
            }
            onKeyDown={(e) => {
              keyDown(e, formRef[0], formRef[1]);
            }}
            value={form.formData[data]}
            aria-describedby={`error-${text}`}
          />
          {hidden && (
            <div
              className="hidden-pass"
              onClick={() => {
                if (pass) {
                  setPass(false);
                } else {
                  setPass(true);
                }
              }}
            >
              {pass ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </div>
          )}
        </div>
      </div>
      <ErrorMessage err={err} text={text} />
    </div>
  );
}

export function InputAuthNumber({
  text,
  err,
  num,
  maxNum,
  form,
  data,
  inputRef,
  formRef,
}) {
  useEffect(() => {
    addFocus(inputRef);
  }, []);

  let error;

  if (err) {
    error = "error";
  } else {
    error = "";
  }

  return (
    <div className="input-auth">
      <div className="input-name" onClick={() => focus(num, inputRef)}>
        {text}
      </div>

      <input
        type="text"
        className={error}
        maxLength={maxNum}
        ref={setRefs(`step-${num}`, inputRef)}
        key={`step-${num}`}
        onChange={(e) => {
          const replace = e.target.value.replace(/\D/g, "");
          form.setFormData({ ...form.formData, [data]: replace });
        }}
        onKeyDown={(e) => {
          keyDown(e, formRef[0], formRef[1]);
        }}
        value={form.formData[data]}
        aria-describedby={`error-${text}`}
      />
      <ErrorMessage err={err} text={text} />
    </div>
  );
}

export function InputAuthButton({
  text,
  err,
  num,
  form,
  data,
  buttonData,
  inputRef,
  setPersona,
  formRef,
}) {
  useEffect(() => {
    addFocus(inputRef);
  }, []);

  let error;

  if (err) {
    error = "error";
  } else {
    error = "";
  }

  const [buttonOpen, setButtonOpen] = useState({
    month: false,
    gen: false,
    newGen: false,
  });

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const Gender = ["Homem", "Mulher", "Prefiro não dizer", "Personalizar"];
  const optionGender = ["Homem", "Mulher", "outros"];

  return (
    <div className="input-auth">
      <div
        className="input-name"
        onClick={() => {
          focus(num, inputRef);
          setButtonOpen({ ...buttonOpen, [buttonData]: true });
        }}
        onBlur={() => setButtonOpen({ ...buttonOpen, [buttonData]: false })}
      >
        {text}
      </div>

      <button
        type="button"
        className={error}
        ref={setRefs(`step-${num}`, inputRef)}
        key={`step-${num}`}
        onClick={() => setButtonOpen({ ...buttonOpen, [buttonData]: true })}
        onBlur={() => setButtonOpen({ ...buttonOpen, [buttonData]: false })}
        onKeyDown={(e) => {
          keyDown(e, formRef[0], formRef[1]);
        }}
        value={form.formData[data]}
        aria-describedby={`error-${text}`}
      >
        <p>{form.formData[data]}</p>
        <div>▼</div>
        {buttonOpen.month === true && buttonData === "month" && (
          <ul>
            {months.map((month, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  form.setFormData({ ...form.formData, month: month });
                  setButtonOpen({
                    ...buttonOpen,
                    month: false,
                  });
                }}
              >
                {month}
              </li>
            ))}
          </ul>
        )}

        {buttonOpen.gen === true && buttonData === "gen" && (
          <ul>
            {Gender.map((gen, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (gen === "Personalizar") {
                    setButtonOpen({
                      ...buttonOpen,
                      gen: false,
                    });
                    setPersona(true);
                    form.setFormData({
                      ...form.formData,
                      selectGen: gen,
                      gen: "",
                      optGen: "",
                    });
                  } else {
                    setButtonOpen({
                      ...buttonOpen,
                      gen: false,
                    });
                    setPersona(false);
                    form.setFormData({ ...form.formData, selectGen: gen });
                  }
                }}
              >
                {gen}
              </li>
            ))}
          </ul>
        )}
        {buttonOpen.newGen === true && buttonData === "newGen" && (
          <ul>
            {optionGender.map((optGen, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  form.setFormData({
                    ...form.formData,
                    optGen: optGen,
                  });
                  setButtonOpen({
                    ...buttonOpen,
                    newGen: false,
                  });
                }}
              >
                {optGen}
              </li>
            ))}
          </ul>
        )}
      </button>
      <ErrorMessage err={err} text={text} />
    </div>
  );
}
