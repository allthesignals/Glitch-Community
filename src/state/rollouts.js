import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';

const Context = createContext();

export const OptimizelyProvider = ({ optimizely, children }) => (
  <Context.Provider value={optimizely}>{children}</Context.Provider>
);

const useOptimizely = () => useContext(Context);

const useOptimizelyValue = (getValue, dependencies) => {
  const optimizely = useOptimizely();
  const [value, setValue] = useState(() => getValue(optimizely));
  const getValueCallback = useCallback(getValue, dependencies);
  useEffect(() => {
    const event = enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE;
    const id = optimizely.notificationCenter.addNotificationListener(event, () => {
      setValue(getValueCallback(optimizely));
    });
    setValue(getValueCallback(optimizely));
    return () => optimizely.notificationCenter.removeNotificationListener(id);
  }, [optimizely, getValueCallback]);
  return value;
};

export const useFeatureEnabled = (whichToggle, entityId) => useOptimizelyValue(
  (optimizely) => optimizely.isFeatureEnabled(whichToggle, entityId),
  [whichToggle, entityId],
);
