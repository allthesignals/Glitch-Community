import React, { createContext, useContext, useEffect, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { useCurrentUser } from 'State/current-user';

const Context = createContext();

export const OptimizelyProvider = ({ optimizely, children }) => (
  <Context.Provider value={optimizely}>{children}</Context.Provider>
);

const useOptimizely = () => useContext(Context);

const useOptimizelyValue = (getValue, dependencies) => {
  const optimizely = useOptimizely();
  const [value, setValue] = useState(() => getValue(optimizely));
  useEffect(() => {
    const event = enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE;
    const id = optimizely.notificationCenter.addNotificationListener(event, () => {
      setValue(getValue(optimizely));
    });
    setValue(getValue(optimizely));
    return () => optimizely.notificationCenter.removeNotificationListener(id);
  }, [optimizely, ...dependencies]);
  return value;
};

export const useFeatureEnabledForEntity = (whichToggle, entityId) => useOptimizelyValue(
  (optimizely) => optimizely.isFeatureEnabled(whichToggle, String(entityId)),
  [whichToggle, entityId],
);

export const useFeatureEnabled = (whichToggle) => {
  const { currentUser } = useCurrentUser();
  return useFeatureEnabledForEntity(whichToggle, currentUser.id);
};
