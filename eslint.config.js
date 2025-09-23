// eslint.config.js (ที่ root)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
    // ignore ทั่วไป
    { ignores: ["**/dist/**", "**/build/**", "**/.turbo/**", "**/node_modules/**"] },

    // กฎพื้นฐาน JS
    js.configs.recommended,

    // TypeScript (แบบไม่ต้องใช้ type-checker ก่อน เพื่อให้ง่ายและเร็ว)
    ...tseslint.configs.recommended,

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
        },
    },

    // ปิดกฎที่ชนกับ Prettier
    prettier,
];
