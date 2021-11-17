import { formValidation } from "../main";
import { register } from "../api";

$(function () {
  const form = document.getElementById("signupForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordConfirm = document.getElementById("passwordConfirm");

  // Ensure the passwordConfirm matches the password.
  $(password).on("input", function () {
    passwordConfirm.setAttribute("pattern", password.value);
  });

  formValidation(form);

  $(form).on("submit-validated", function () {
    register(email.value, password.value, null, null).then(undefined);
  });

});

