const path = require('path');

const makeAliases = (root) => ({
  Components: path.join(__dirname, root, './components'),
  Utils: path.join(__dirname, root, './utils'),
  Curated: path.join(__dirname, root, './curated'),
  Models: path.join(__dirname, root, './models'),
  State: path.join(__dirname, root, './state'),
  Hooks: path.join(__dirname, root, './hooks'),
  Shared: path.join(__dirname, './shared'),
});

const clientPath = './src';
const buildPath = './build/node';
const useBuildPath = process.env.BUILD_TYPE && process.env.BUILD_TYPE !== 'memory';
const serverPath = useBuildPath ? buildPath : clientPath;

module.exports = {
  server: makeAliases(serverPath),
  client: makeAliases(clientPath),
};
