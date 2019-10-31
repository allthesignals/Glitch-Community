import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { useCurrentUser } from './current-user';

const Context = createContext();

export const OptimizelyProvider = ({ optimizely, optimizelyId: initialOptimizelyId, children }) => {
  const [optimizelyId, setId] = useState(initialOptimizelyId);
  const setOptimizelyId = (id) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `optimizely-id=${id}; path=/; expires=${expires}`;
    setId(id);
  };
  const value = useMemo(() => ({ optimizely, optimizelyId, setOptimizelyId }), [optimizely, optimizelyId]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useOptimizely = () => useContext(Context);

const useOptimizelyValue = (getValue, dependencies) => {
  const { optimizely } = useOptimizely();
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
  const { optimizelyId } = useOptimizely();
  return useFeatureEnabledForEntity(whichToggle, optimizelyId);
};

export const RolloutsUserSync = () => {
  const { currentUser } = useCurrentUser();
  const { setOptimizelyId } = useOptimizely();
  useEffect(() => {
    if (currentUser.login && currentUser.id) {
      setOptimizelyId(currentUser.id);
    }
  }, [currentUser.id, currentUser.login]);
  return null;
};

export const useRolloutsDebug = () => {
  const { optimizelyId } = useOptimizely();
  return useOptimizelyValue((optimizely) => {
    const data = optimizely.projectConfigManager.datafileManager.get();
    return data;
  }, [optimizelyId]);
};
