const { setLogLevel, setLogger, logging, createInstance } = require('@optimizely/optimizely-sdk');
const constants = require('./constants').current;

setLogLevel('warning');
setLogger(logging.createLogger());

const optimizelyClient = createInstance({
  sdkKey: process.env.OPTIMIZELY_KEY || constants.OPTIMIZELY_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60 * 1000, // check once per minute
  },
});

const getOptimizely

const getOptimizelyData = () => {
  return optimizelyClient.projectConfigManager.datafileManager.get();
};