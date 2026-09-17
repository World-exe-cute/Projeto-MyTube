import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// redux
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleReCaptchaProvider>,
);
