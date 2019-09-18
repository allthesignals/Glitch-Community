import { setLogLevel, setLogger, logging, createInstance } from '@optimizely/optimizely-sdk';

setLogLevel('info');
setLogger(logging.createLogger());

const optimizelyClientInstance = createInstance({
  sdkKey: process.env.OPTIMIZELY_KEY || 'SUV4dn9FiCp1osqWQUZr82',
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 1000,
  },
});

export default optimizelyClientInstance;

const useRolloutToggle = (whichToggle, entityId) => {
  
  
};
