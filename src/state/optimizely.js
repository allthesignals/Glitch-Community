import React, { createContext, useContext } from 'react';

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
