import { formValidation } from "../main";
import { login } from "../api";

$(function () {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  formValidation(form);

  $(form).on("submit-validated", function () {
    login(email.value, password.value, null, null).then(undefined);
  });

});

