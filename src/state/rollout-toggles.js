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
// import useRolloutToggle from 'State/rollout-toggles`
//
// const NewFeatureIfEnabled = () => {
//   const showNewFeature = useRolloutToggle('New Feature');
//   return showNewFeature ? <NewFeature /> : null;
// };

const useRolloutToggle = (whichToggle, entityId) => optimizelyClientInstance.isFeatureEnabled(whichToggle, entityId);

export default useRolloutToggle;
