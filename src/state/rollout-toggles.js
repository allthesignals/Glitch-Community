import { setLogLevel, setLogger, logging, createInstance } from '@optimizely/optimizely-sdk';

setLogLevel('info');
setLogger(logging.createLogger());

const optimizelyClientInstance = createInstance({
  sdkKey: process.env.OPTIMIZELY_KEY || 'SUV4dn9FiCp1osqWQUZr82',
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60 * 1000, // check once per minute
  },
});

// Usage:
//
// import isFeatureEnabled from 'State/rollout-toggles`
//
// const NewFeatureIfEnabled = () => {
//   const showNewFeature = isFeatureEnabled('New Feature');
//   return showNewFeature ? <NewFeature /> : null;
// };

const isFeatureEnabled = (whichToggle, entityId) => optimizelyClientInstance.isFeatureEnabled(whichToggle, entityId);

export default isFeatureEnabled;
