// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  // Ignore generated & config files
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "prisma/migrations/**",
      "eslint.config.*",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (NOT type-aware)
  ...tseslint.configs.recommended,

  // Project rules for TS files
  {
    files: ["**/*.ts"],
    plugins: { import: importPlugin, prettier: prettierPlugin },
    rules: {
      // TS
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // Imports
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "off", // TS handles this

      // Prettier
      "prettier/prettier": [
        "error",
        {
          semi: false,
          singleQuote: false,
          trailingComma: "all",
          printWidth: 100,
        },
      ],

      "no-console": "off",
    },
  },

  // Turn off rules that conflict with Prettier formatting
  configPrettier,
];
