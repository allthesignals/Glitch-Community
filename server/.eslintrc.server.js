const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: 'eslint:recommended',
  env: {
    es6: true, // We are writing ES6 code
    node: true, // for Node.js
  },
  parser: 'babel-eslint',
  rules: {
    'no-console': OFF,
    'arrow-parens': [ERROR, 'always'],
    'operator-linebreak': [ERROR, 'after', { overrides: { '?': 'before', ':': 'before' } }],
    // disabled for prettier compatibility
    'implicit-arrow-linebreak': OFF,
    'object-curly-newline': OFF,
    'no-confusing-arrow': OFF,
  },
};
