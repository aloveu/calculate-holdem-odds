/*global require, module*/
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier/skip-formatting'],
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    indent: 'off',
    'comma-dangle': 'off',
    'vue/multi-word-component-names': 'off',
    'object-curly-spacing': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    'arrow-parens': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 0,
    'function-paren-newline': 'off',
    'func-call-spacing': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'max-len': ['error', 250],
    'no-empty-function': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-useless-escape': 'off',
    'no-use-before-define': [
      'error',
      {
        variables: true,
        functions: false,
        classes: false,
      },
    ],
    'space-before-blocks': 'error',
    'space-before-function-paren': 'off',
    'comma-style': 'error',
    'dot-notation': 'off',
    'no-void': 'off',
    semi: 'error',
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    yoda: 'off',
    'prefer-destructuring': [
      'error',
      {
        object: false,
        array: false,
      },
    ],
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    'no-extra-boolean-cast': 'off',
    'arrow-body-style': 'off',
    'no-restricted-globals': 'off',
    'new-cap': 'off',
    'no-restricted-properties': 'off',
    '@angular-eslint/no-input-rename': 'off',
    'consistent-return': 'off',
    'no-bitwise': 'off',
    'global-require': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'import/no-extraneous-dependencies': 'off',
    'implicit-arrow-linebreak': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns:[
    'gt.0.4.9.js'
  ]
};
