module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "linebreak-style": 0,
    "no-console": "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
