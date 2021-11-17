import { config } from "./config";
import axios from "axios";
import { i18n } from "./i18n";

const apiService = axios.create({
  baseURL: config.apiUrl,
  headers: { "Content-Type": "application/json; charset=utf-8" }
});

/**
 * Called when login or registration is complete.
 * @param {"register"|"login"} action The action.
 * @param {String} userId
 * @param {String} token
 */
function authComplete(action, userId, token) {
  location.href = new URL(`#/auth/${action}/${encodeURIComponent(userId)}/${encodeURIComponent(token)}`, config.appBaseUrl).toString();
}

/**
 * Listen for request errors, invoking a callback with the error message.
 * If an error is handled already, it should set the `handled` field to true to prevent this error being reported.
 *
 * @param {ShowErrorFunc} showError The callback to present an error message.
 */
export function useErrorHandler(showError) {
  if (apiService.errorHandlerId !== undefined) {
    // Only one error handler is required.
    apiService.interceptors.response.eject(apiService.errorHandlerId);
  }

  apiService.errorHandlerId = apiService.interceptors.response.use(undefined, (err) => {
    // Called when the HTTP request rejects.
    return new Promise(() => {
      // Using a timer to ensure this is being executed after any request-specific error handling.
      // This is due promises being stacked, and there's no way to tell if the promise rejection is going to
      // be handled after this one.
      setTimeout(() => {
        if (!err.handled) {
          const errorMessage = getErrorMessage(err, true);
          showError(errorMessage.message, errorMessage.title);
        }
      }, 100);
      throw err;
    });
  });
}

/**
 * Gets a message for the user from an Error object.
 *
 * The message is based from one of the following fields in the Error object, in priority:
 * - err.userMessage
 * - err.response.data.error: an error code form the service, which is localised.
 * - err.response.status: localised generic message based on the HTTP status code
 * - err.response.statusText
 * - err.message
 * - A generic message.
 *
 * @param {Error} err The error.
 * @param {Boolean} includeTitle Also include the title (returns an {ErrorMessage} object).
 * @return {String|ErrorMessage} The error message.
 */
export function getErrorMessage(err, includeTitle) {
  /** @type {ErrorMessage} */
  const togo = {};

  if (includeTitle) {
    const action = err.config?.action || i18n.t("Errors.generic-action");
    togo.title = i18n.t("Errors.generic-title", {action: action});
  }

  if (err.userMessage) {
    // A message has been explicitly defined.
    togo.message = err.userMessage;
  } else if (err.response) {
    // Use the error code from the response
    const apiError = err.response.data?.error;
    if (apiError) {
      const messageKey = `Errors.${apiError}`;
      const responseError = i18n.t(messageKey, {errorCode: apiError});

      if (responseError && responseError !== messageKey) {
        togo.message = responseError;
      } else {
        togo.message = i18n.t("Errors.generic-server-error", {message: apiError});
      }
    } else {
      // Use the http status code to create an error message.
      const errorCode = err.response?.status || err.code;
      const statusMessageKey = `Errors.http.${err.response.status}`;
      togo.message = i18n.t(statusMessageKey, {errorCode: errorCode});

      if (!togo.message || togo.message === statusMessageKey) {
        // No message - just quote the server status.
        togo.message = i18n.t("Errors.generic-server-error", {message: `${err.response.statusText} (${err.response.status})`});
      }
    }
  } else {
    togo.message = err.message || i18n.t("Errors.generic-server-error", {message: err.code || err.name});
  }

  return includeTitle ? togo : togo.message;
}

/**
 *
 * @param username
 * @param password
 * @return {Promise<void>}
 */
export async function login(username, password) {
  const response = await apiService.post("/v1/auth/username", {username, password});
  authComplete("login", response.data.user.id, response.data.token);
}

export async function register(email, password, firstName, lastName) {
  const response = await apiService.post("/v1/register/username", {
    username: email,
    password,
    email,
    first_name: firstName,
    last_name: lastName
  });
  authComplete("login", response.data.user.id, response.data.token);
}
