module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: [
    'vue',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    // '@vue/prettier',
    '@tencent/eslint-config-tencent',
  ],
  parser: 'vue-eslint-parser',

  parserOptions: {
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
    // ecmaFeatures: { legacyDecorators: true },
  },
  rules: {
    'max-len': 0,
    'no-param-reassign': 0
  },
};
