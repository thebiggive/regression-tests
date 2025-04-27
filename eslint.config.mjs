// @ts-check

import eslint from '@eslint/js';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import { configs as wdioConfig } from "eslint-plugin-wdio";
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    {
        files: ["**/*.ts"],
        extends: [
            wdioConfig['flat/recommended']
        ],
        rules: {
            'no-unused-vars': 'off',
            'import/no-dynamic-require': 'warn',
            'import/no-nodejs-modules': 'warn',
            'wdio/no-pause': 'warn',
            'no-await-in-loop': 'error',
            'prefer-object-spread': 'error',
            'import/prefer-default-export': 'error',
            'max-len': ["error", { "code": 125}],
            'no-unreachable': 'error',

            '@typescript-eslint/no-explicit-any': 'off',
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.amd,
            },
        },
        settings: {
            "import/resolver": {
                "node": {
                    "extensions": [".ts"]
                },
                "caseSensitive": false
            }
        }
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.amd,
            },
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    }
);