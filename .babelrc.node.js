const stylus = require('stylus');

module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: true }, useBuiltIns: false }],
  ],
  plugins: [
    'styled-components',
    '@babel/syntax-dynamic-import',
  ],
  babelrc: false,
};
