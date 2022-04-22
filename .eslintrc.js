module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    '@nahmii'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    quotes: ['error', 'single'],
    indent: ['error', 2]
  }
};
