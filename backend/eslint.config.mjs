import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
    { files: ["**/*.{js,mjs,cjs,jsx,ts}"] },
    {
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.node },
        },
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...fixupConfigRules(pluginReactConfig),
];
