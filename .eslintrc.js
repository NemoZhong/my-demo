module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prefer-spread":0,
    "@typescript-eslint/no-var-requires":0,
    "@typescript-eslint/ban-ts-ignore":"off",
    "@typescript-eslint/no-explicit-any":0,
    "@typescript-eslint/no-non-null-assertion":0,
    "@typescript-eslint/no-unused-vars":0,
    "no-async-promise-executor":"off",
  }
};
