module.exports = {
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 120 }],
  },
};
