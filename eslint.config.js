// eslint.config.js (ที่ root)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  // ignore ทั่วไป
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/node_modules/**",
    ],
  },

  // กฎพื้นฐาน JS
  js.configs.recommended,

  // TypeScript (แบบไม่ต้องใช้ type-checker ก่อน เพื่อให้ง่ายและเร็ว)
  ...tseslint.configs.recommended,

  // กฎสะอาดๆ ที่ใช้ได้กับทั้งโค้ด TS/JS ทั้งโปรเจกต์
  {
    files: ["**/*.{ts,tsx,js}"],
    rules: {
      // ความสะอาดทั่วไป
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["warn", "multi-line"],
      "no-implicit-coercion": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "arrow-body-style": ["warn", "as-needed"],
      "sort-imports": [
        "warn",
        { ignoreDeclarationSort: true, allowSeparatedGroups: true },
      ],

      // TypeScript-focused
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", disallowTypeAnnotations: false },
      ],
      "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        { "ts-ignore": "allow-with-description", minimumDescriptionLength: 3 },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // React (เฉพาะแอปเว็บ)
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      // React clean code
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
      "react/self-closing-comp": "warn",
    },
  },

  // ปิดกฎที่ชนกับ Prettier
  prettier,
];
