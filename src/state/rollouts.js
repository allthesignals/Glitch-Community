import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { useCurrentUser } from './current-user';
import { useGlobals } from './globals';
import useUserPref from './user-prefs';

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

const defaultOverrides = {};
const useOptimizely = () => useContext(Context);
const useOverrides = () => useUserPref('optimizelyOverrides', defaultOverrides);

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

export const useFeatureEnabledForEntity = (whichToggle, entityId, attributes) => {
  const [overrides] = useOverrides();
  const raw = useOptimizelyValue(
    (optimizely) => optimizely.isFeatureEnabled(whichToggle, String(entityId), attributes),
    [whichToggle, entityId, attributes],
  );
  return overrides[whichToggle] !== undefined ? !!overrides[whichToggle] : raw;
};

export const useFeatureEnabled = (whichToggle) => {
  const { optimizelyId } = useOptimizely();
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN } = useGlobals();

  const attributes = useMemo(() => {
    const fakeSignedIn = !currentUser.id && SSR_SIGNED_IN;
    const hasLogin = !!(currentUser.login || fakeSignedIn);
    const hasProjects = currentUser.projects.length > 0;
    return { hasLogin, hasProjects };
  }, [currentUser.id, currentUser.login, SSR_SIGNED_IN, currentUser.projects.length]);

  return useFeatureEnabledForEntity(whichToggle, optimizelyId, attributes);
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
  const [overrides, setOverrides] = useOverrides();
  return useOptimizelyValue((optimizely) => {
    const config = optimizely.projectConfigManager.getConfig();
    const features = config.featureFlags.map(({ key }) => {
      const enabled = optimizely.isFeatureEnabled(key, String(optimizelyId));
      const forced = overrides[key];
      const setForced = (value) => setOverrides({ ...overrides, [key]: value });
      return { key, enabled, forced, setForced };
    });
    return { features };
  }, [optimizelyId, overrides, setOverrides]);
};
