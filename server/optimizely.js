const { createInstance } = require('@optimizely/optimizely-sdk');
const { captureException } = require('@sentry/node');
const constants = require('./constants').current;

const optimizelyClient = createInstance({
  sdkKey: process.env.OPTIMIZELY_KEY || constants.OPTIMIZELY_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60 * 1000, // check once per minute
  },
  errorHandler: {
    handleError: (error) => {
      captureException(error);
      console.error(error);
    },
  },
  logLevel: 'warn',
});

const getOptimizelyClient = async () => {
  await optimizelyClient.onReady();
  return optimizelyClient;
};

const getOptimizelyData = async () => {
  await optimizelyClient.onReady();
  return optimizelyClient.projectConfigManager.datafileManager.get();
};

module.exports = { getOptimizelyClient, getOptimizelyData };