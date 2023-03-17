module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: [
    'vue',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
  ],
  parser: 'vue-eslint-parser',

  parserOptions: {
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
    // ecmaFeatures: { legacyDecorators: true },
  },
  rules: {
    'max-len': 0,
    'no-param-reassign': 0,
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'arrow-parens': 0
  },
};