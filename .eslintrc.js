module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2022: true
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
