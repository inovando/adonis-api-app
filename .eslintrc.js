module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  globals: {
    use: true,
  },
};
