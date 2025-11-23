import React from "react";
import ReactDOM from "react-dom/client";
import { AuthenticatorApp as App } from "./App";
import "./App.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ToastContainer
      stacked
      theme="dark"
      hideProgressBar
      autoClose={500}
      closeOnClick
      className={"bg-secondary"}
      position="bottom-center"
    ></ToastContainer>
    <App />
  </React.StrictMode>
);
