/* eslint-disable @typescript-eslint/no-require-imports */
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const jestPlugin = require("eslint-plugin-jest");
/* eslint-enable @typescript-eslint/no-require-imports */

const config = [
  {
    ignores: ["dist/**"], // Excluye el directorio dist
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: typescriptParser,
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      quotes: "off",
      indent: "off",
      semi: ["error", "always"],
      "@typescript-eslint/no-require-imports": "off", // Desactiva la regla para permitir require()
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["test/**/*.ts"], // Aplica esta configuración solo a los archivos de prueba
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];

module.exports = config;