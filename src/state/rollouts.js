import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';

const Context = createContext();

export const OptimizelyProvider = ({ optimizely, children }) => (
  <Context.Provider value={optimizely}>{children}</Context.Provider>
);

const useOptimizely = () => useContext(Context);

const useOptimizelyValue = (getValue) => {
  const optimizely = useOptimizely();
  const [value, setValue] = useState(() => getValue(optimizely));
  useEffect(() => {
    const event = enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE;
    const id = optimizely.notificationCenter.addNotificationListener(event, () => {
      setValue(getValue(optimizely));
    });
    setValue(getValue(optimizely));
    return () => optimizely.notificationCenter.removeNotificationListener(id);
  }, [optimizely, getValue]);
  return value;
};

export const useFeatureEnabled = (whichToggle, entityId) => {
  const getValue = useCallback((optimizely) => optimizely.isFeatureEnabled(whichToggle, entityId), [whichToggle, entityId]);
  return useOptimizelyValue(getValue);
};
