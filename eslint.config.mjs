import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-plugin-prettier/recommended';
import html from 'eslint-plugin-html';

export default defineConfig([
  {files: ['**/*.{js,mjs,cjs,ts}']},
  {files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: {globals: globals.browser}},
  {files: ['**/*.{js,mjs,cjs,ts}'], plugins: {js}, extends: ['js/recommended']},
  tseslint.configs.recommended,
  {
    files: ['**/*.html'],
    plugins: {html}
  },
  eslintConfigPrettier,
  globalIgnores(['dist/*'])
]);
