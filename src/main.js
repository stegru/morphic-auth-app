import "./style/app.scss";
import "./header.js";
import cash from "cash-dom";
import { useErrorHandler } from "./api";

window.$ = cash;

/**
 * Add validation to a form.
 * @param {HTMLFormElement} form The form.
 */
export function formValidation(form) {
  $("input", form).on("input", function (e) {
    e.target.hasChanged = e.target.value !== "";
  });

  // Validate on blur
  $("input", form).on("blur", function (e) {
    if (e.target.hasChanged) {
      $(e.target).parent()[0].classList.add("was-validated");
    }
  });

  // Validate the form on submit
  $(form).on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const valid = form.checkValidity();
    form.classList.add("was-validated");

    if (valid) {
      $(form).trigger("submit-validated");
    } else {
      $("input:invalid").first()[0].focus();
    }
  });

  // Handle errors from the API server
  const alert = document.getElementById("formAlert");
  alert && useErrorHandler((errorMessage) => {
    alert.innerText = errorMessage;
  });

  // Password reveal button
  $(".input-password ~ .toggle-password", form).on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const input = document.getElementById(this.getAttribute("input-id"));
    const type = input.getAttribute("type");
    input.setAttribute("type", type === "password" ? "text" : "password");
    if (e.pointerType === "mouse") {
      input.focus();
    }
  });
}

$(function () {
  $("template").each((i, elem) => makeComponent(elem));
});


/**
 * Creates a component from a template
 * @param {HTMLTemplateElement} template The template element
 */
export function makeComponent(template) {
  const name = template.id.replace(/-component$/, "");

  customElements.define(name, class extends HTMLElement {
    constructor() {
      super();

      const newNode = document.createElement("div");

      // ${name} ${name?fallback} ${name?ifTrue:ifFalse}
      const interpolate = /\$\{(?<name>[^:}?]+)(:(?<fallback>[^}?]+))?(\?(?<ifTrue>[^:}]*):(?<ifFalse>[^}]*))?\}/g;

      // Replace the expanders in the template, with attribute values from the instance tag.
      newNode.innerHTML = template.innerHTML.replace(interpolate, (...args) => {
        const groups = args[args.length - 1];

        let value = this.getAttribute(groups.name);

        if (value === null) {
          value = groups.fallback === undefined ? null : groups.fallback;
        }

        if (groups.ifTrue !== undefined) {
          value = value == null ? groups.ifTrue : groups.ifFalse;
        }

        return value;
      });

      // Copy the attributes of the template onto the component instance
      Object.values(template.attributes).forEach(attr => {
        if (attr.nodeName !== "id" && newNode.getAttribute(attr.nodeName) === null) {
          newNode.setAttribute(attr.nodeName, attr.nodeValue);
        }
      });

      this.replaceWith(newNode);
    }
  });

}
