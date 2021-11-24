

const href = new URL(location.href);

var env;
if (href.host.endsWith(".morphic.dev")) {
  env = "STAGING";
} else if (href.host.endsWith(".morphic.org")) {
  env = "PRODUCTION";
} else if (href.host.match(/^pr-\d+\.morphic\.ste-test\.net$/)) {
  env = "PR";
} else {
  env = "LOCAL";
}

/**
 * @typedef {Object} AppConfig
 * @property {String} apiUrl API base url.
 * @property {String} env The config environment.
 * @property {String} appBaseUrl The url to direct to when authenticated.
 * @property {String} loggedInUrl The url to direct to when authenticated.
 * @property {String} registeredUrl The url to direct to when registered.
 * @property {String} recaptchaSiteKey
 */

/**
 * @type {Object<string,AppConfig>}
 */
const configs = {
  BASE: {
    env: env,
    apiUrl: "",
    recaptchaSiteKey: "6LcDs3waAAAAAFGKPHxnNuPBO__5LqaEybnS6wn0",
    pages: {"login":".","signup":"signup.html","passwordReset":"password-reset.html"}
  },
  LOCAL: {
    apiUrl: href.origin + "/api",
    appBaseUrl: ((url) => {
      // use the same as this site, but change the port to 8080
      const u = new URL(url);
      u.port = 8080;
      return u.toString();
    })(href.origin),

    // Valid for ste-test.net: to test locally, use localhost.ste-test.net
    recaptchaSiteKey: href.host.match(/^[0-9.:]+$/) ? null : "6LcgxGoaAAAAACb4-Sdm1xj5UWQiuyYAieFZUhL4"
  },
  PR: {
    apiUrl: "https://api.morphic.dev",
    appBaseUrl: "https://custom.morphic.dev",
    recaptchaSiteKey: "6LcgxGoaAAAAACb4-Sdm1xj5UWQiuyYAieFZUhL4"
  },
  STAGING: {
    apiUrl: "https://api.morphic.dev",
    appBaseUrl: "https://custom.morphic.dev"
  },
  PRODUCTION: {
    apiUrl: "https://api.morphic.org",
    appBaseUrl: "https://custom.morphic.org"
  }
};


/** @type {AppConfig} */
export const config = Object.assign({}, configs.BASE, configs[env]);

