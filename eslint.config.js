import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import neostandard from 'neostandard' // StandardJS style guide for ESLint 9+

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'cypress/**', 'coverage/**', 'storybook-static/**', '.storybook/**']
  },
  // StandardJS Style Guide
  ...neostandard({
    noStyle: true
  }),
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off'
    }
  }
]
