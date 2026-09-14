import { useEffect, useCallback } from "react";
import "./EventModal.css";

export default function EventModal({ element, input = null, focus, step }) {
  const scriptModal = useCallback(
    (e) => {
      element.forEach((value) => {
        const active = value.current.classList[1];
        if (
          !value.current.contains(e.target) &&
          e.target !== value.current &&
          active === "show"
        ) {
          value.current.classList.remove("show");
          focus.setFocus(false);
          if (step) {
            step(1);
          }
          if (input) {
            if (input.current) {
              input.current.value = "";
            }
          }
        }
      });
    },
    [input, element],
  );

  useEffect(() => {
    document.addEventListener("click", scriptModal);

    return () => {
      document.removeEventListener("click", scriptModal);
    };
  }, [scriptModal]);

  return (
    <div
      id="hidden"
      className={`hidden-wall ${focus.focus ? "show" : ""}`}
    ></div>
  );
}
