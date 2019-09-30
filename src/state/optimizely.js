import React, { createContext, useContext } from 'react';
import { setLogLevel, setLogger, logging, createInstance } from '@optimizely/optimizely-sdk';

const Context = createContext();

export const OptimizelyProvider = ({ optimizely, children }) => (
  <Context.Provider value={optimizely}>{children}</Context.Provider>
);

const useOptimizely = () => useContext(Context);

export const useFeatureEnabled = (whichToggle, entityId) => {
  const optimizely = useOptimizely();
  // TODO: force a re render when the optimizely config changes because the feature toggle could change
  return optimizely.isFeatureEnabled(whichToggle, entityId);
};

setLogLevel('warning');
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
