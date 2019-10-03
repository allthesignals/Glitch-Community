console.log('over here');
require('@babel/register')({
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          chrome: '41',
          edge: '16',
        },
        corejs: 'runtime',
      },
    ],
  ],
  plugins: ['@babel/syntax-dynamic-import', '@babel/plugin-proposal-class-properties'],
  // configFile: "./.babelrc.json"
});
