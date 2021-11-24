import { formValidation } from "./main.js";
import { login } from "./api.js";

$(function () {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginMessage = document.getElementById("loginMessage");

  formValidation(form, () => login(email.value, password.value, null, null));

  const message = sessionStorage.getItem("loginMessage");
  if (message) {
    sessionStorage.removeItem("loginMessage");
    loginMessage.innerText = message;
  }

});
