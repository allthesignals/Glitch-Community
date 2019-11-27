import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { useTracker } from './segment-analytics';
import { useCurrentUser } from './current-user';
import useUserPref from './user-prefs';

// human readable rollout state to include in analytics
const DEFAULT_DESCRIPTION = {
  true: ['variant', 'showing the new form'],
  false: ['control', 'showing the original form'],
};
const ROLLOUT_DESCRIPTIONS = {
  analytics: {
    true: ['enabled', 'analytics are shown on team pages'],
    false: ['disabled', 'team analytics are not shown'],
  },
  test_feature: {
    true: ['yep', 'this is in fact a test'],
    false: ['nope', 'but it is still a test'],
  },
  swap_index_create: {
    true: ['swapped', 'create is shown at the index'],
    false: ['control', 'see the existing homepage'],
  },
};

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

export const useFeatureEnabledForEntity = (whichToggle, entityId) => {
  const [overrides] = useOverrides();
  const raw = useOptimizelyValue(
    (optimizely) => optimizely.isFeatureEnabled(whichToggle, String(entityId)),
    [whichToggle, entityId],
  );
  const enabled = overrides[whichToggle] !== undefined ? !!overrides[whichToggle] : raw;

  const track = useTracker('Experiment Viewed');
  const { id } = useOptimizelyValue(
    (optimizely) => optimizely.projectConfigManager.getConfig().featureKeyMap[whichToggle],
    [whichToggle],
  );
  useEffect(() => {
    const [variant, description] = (ROLLOUT_DESCRIPTIONS[whichToggle] || DEFAULT_DESCRIPTION)[enabled];
    track({
      experiment_id: id,
      experiment_name: whichToggle,
      experiment_group: enabled ? 'variant' : 'control',
      variant_type: variant,
      variant_description: description,
    });
  }, [id, whichToggle, enabled]);

  return enabled;
};

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
