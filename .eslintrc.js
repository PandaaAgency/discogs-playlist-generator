module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'standard'
    // 'plugin:prettier/recommended'
  ],
  plugins: [
    'vue',
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": "error",
    // specify curly brace conventions for all control statements
    "curly": ["error", "all"],
    "brace-style": ["error", '1tbs', {
      "allowSingleLine": false
    }],
    'max-len': ["error", 120, 4]
  }
}


