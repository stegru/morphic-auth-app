import Polyglot from "node-polyglot";

const phrases = require("./locales/en.json");

export const i18n = new Polyglot({
  phrases
});
