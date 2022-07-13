module.exports ={
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-prototype-builtins":"warn",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars":"warn",
    "@typescript-eslint/consistent-type-definitions":"off",
    "@typescript-eslint/no-var-requires":"warn",
  }
}
