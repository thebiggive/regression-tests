// @ts-check

import eslint from '@eslint/js';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import { configs as wdioConfig } from "eslint-plugin-wdio";
// eslint-disable-next-line import/no-unresolved
import {globalIgnores} from "eslint/config";
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    globalIgnores(["./build/"]),
    {
        files: ["**/*.ts"],
        extends: [
            wdioConfig['flat/recommended']
        ],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    // https://johnnyreilly.com/typescript-eslint-no-unused-vars
                    // intentionally ignored vars, args etc must start with underscore
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true
                }
            ],
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