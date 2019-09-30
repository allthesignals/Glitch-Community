const { setLogLevel, setLogger, logging, createInstance } = require('@optimizely/optimizely-sdk');

module.exports = ({ sdkKey, datafile }) => {
  setLogLevel('warning');
  setLogger(logging.createLogger());

  return createInstance({
    sdkKey,
    datafile,
    datafileOptions: {
      autoUpdate: true,
      updateInterval: 60 * 1000, // check once per minute
    },
  });
};
