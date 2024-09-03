// eslint.config.mjs
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

const config = [
  {
    ignores: ["dist/**"], // Excluye el directorio dist
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: typescriptParser,
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      quotes: "off",
      indent: "off",
      semi: ["error", "always"],
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },
];

export default config;