import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { useTracker } from './segment-analytics';
import { useCurrentUser } from './current-user';
import { useGlobals } from './globals';
import useUserPref from './user-prefs';

const TESTING_TEAM_ID = 3247;

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
  pufferfish: {
    true: ['enabled', 'pufferfish ui is shown'],
    false: ['disabled', 'pufferfish ui is NOT shown'],
  },
};

// toggles which should not be permitted to be overwritten by /secret
const TESTING_TEAM_MEMBERSHIP_REQUIRED = ['pufferfish'];

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
// the id+attributes combo for the current user
const useDefaultUser = () => {
  const { optimizelyId } = useOptimizely();
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN, SSR_HAS_PROJECTS, IN_TESTING_TEAM } = useGlobals();

  const attributes = useMemo(() => (
    currentUser.id ? {
      hasLogin: !!currentUser.login,
      hasProjects: currentUser.projects.length > 0,
      inTestingTeam: currentUser.login && currentUser.teams && currentUser.teams.filter((t) => t.id === TESTING_TEAM_ID).length > 0,
    } : {
      hasLogin: SSR_SIGNED_IN,
      hasProjects: SSR_HAS_PROJECTS,
      inTestingTeam: IN_TESTING_TEAM,
    }
  ), [currentUser.id, currentUser.login, currentUser.projects.length, SSR_SIGNED_IN, SSR_HAS_PROJECTS, IN_TESTING_TEAM]);
  return [optimizelyId, attributes];
};

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
  const { optimizely } = useOptimizely();
  const [overrides] = useOverrides();
  const raw = useOptimizelyValue(
    (optimizelyInstance) => optimizelyInstance.isFeatureEnabled(whichToggle, String(entityId), attributes),
    [whichToggle, entityId, attributes],
  );

  let enabled;
  if (TESTING_TEAM_MEMBERSHIP_REQUIRED.includes(whichToggle)) {
    enabled = raw && overrides[whichToggle];
  } else {
    enabled = overrides[whichToggle] !== undefined ? !!overrides[whichToggle] : raw;
  }

  const track = useTracker('Experiment Viewed');
  useEffect(() => {
    const [variant, description] = (ROLLOUT_DESCRIPTIONS[whichToggle] || DEFAULT_DESCRIPTION)[enabled];
    const { id } = optimizely.projectConfigManager.getConfig().featureKeyMap[whichToggle];
    track({
      experiment_id: id,
      experiment_name: whichToggle,
      experiment_group: enabled ? 'variant' : 'control',
      variant_type: variant,
      variant_description: description,
    });
  }, [optimizely, whichToggle, enabled]);

  return enabled;
};

export const useFeatureEnabled = (whichToggle) => {
  const [id, attributes] = useDefaultUser();
  return useFeatureEnabledForEntity(whichToggle, id, attributes);
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
  const [id, attributes] = useDefaultUser();
  const [overrides, setOverrides] = useOverrides();
  return useOptimizelyValue((optimizely) => {
    const config = optimizely.projectConfigManager.getConfig();
    const features = config.featureFlags.map(({ key }) => {
      const enabled = optimizely.isFeatureEnabled(key, String(id), attributes);
      const forced = overrides[key];
      const setForced = (value) => setOverrides({ ...overrides, [key]: value });
      return { key, enabled, forced, setForced };
    });
    return { features };
  }, [id, attributes, overrides, setOverrides]);
};
