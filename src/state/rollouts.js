import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { enums } from '@optimizely/optimizely-sdk';
import { userIsInTestingTeam } from 'Utils/constants';
import { useTracker } from './segment-analytics';
import { useCurrentUser } from './current-user';
import { useGlobals } from './globals';
import useUserPref from './user-prefs';
// toggles which require an additional testing team membership (just enabling on /secret is not enough)
const TESTING_TEAM_MEMBERSHIP_REQUIRED = ['pufferfish'];

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

const checkAudience = (optimizely, config, experimentId, attributes) => {
  const { audiencesById, experimentIdMap } = config;
  const { audienceConditions } = experimentIdMap[experimentId];
  return optimizely.decisionService.audienceEvaluator.evaluate(audienceConditions, audiencesById, attributes);
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
// the id+attributes combo for the current user
const useDefaultUser = () => {
  const { optimizelyId } = useOptimizely();
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN, SSR_HAS_PROJECTS, SSR_IN_TESTING_TEAM } = useGlobals();

  const rawAttributes = currentUser.id ? {
    hasLogin: !!currentUser.login,
    hasProjects: currentUser.projects.length > 0,
    inTestingTeam: userIsInTestingTeam(currentUser),
  } : {
    hasLogin: SSR_SIGNED_IN,
    hasProjects: SSR_HAS_PROJECTS,
    inTestingTeam: SSR_IN_TESTING_TEAM,
  };
  const attributes = useMemo(() => rawAttributes, Object.values(rawAttributes));
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

export const useIsEnabledBasedOnOverrides = ({
  whichToggle,
  overrides,
  raw,
  togglesWhichRequireTeamMembership = TESTING_TEAM_MEMBERSHIP_REQUIRED,
}) => {
  if (togglesWhichRequireTeamMembership.includes(whichToggle)) {
    return raw && overrides[whichToggle] !== undefined && overrides[whichToggle];
  }

  return overrides[whichToggle] !== undefined ? !!overrides[whichToggle] : raw;
};

export const useFeatureEnabledForEntity = (whichToggle, entityId, attributes) => {
  const { optimizely } = useOptimizely();
  const [overrides] = useOverrides();
  const raw = useOptimizelyValue((optimizelyInstance) => optimizelyInstance.isFeatureEnabled(whichToggle, String(entityId), attributes), [
    whichToggle,
    entityId,
    attributes,
  ]);
  const enabled = useIsEnabledBasedOnOverrides({ whichToggle, overrides, raw });

  const track = useTracker('Experiment Viewed');
  useEffect(() => {
    const [variant, description] = (ROLLOUT_DESCRIPTIONS[whichToggle] || DEFAULT_DESCRIPTION)[enabled];
    const config = optimizely.projectConfigManager.getConfig();
    const { id, rolloutId } = config.featureKeyMap[whichToggle];
    // if we're running tests for signed out users, don't send the event for signed in users
    // do that by making sure the audience applies to you, and waiting until the event status is 'Running'
    const active = config.rolloutIdMap[rolloutId].experiments.some((experiment) => (
      checkAudience(optimizely, config, experiment.id, attributes) && /running/i.test(experiment.status)
    ));
    if (active) {
      track({
        experiment_id: id,
        experiment_name: whichToggle,
        experiment_group: enabled ? 'variant' : 'control',
        variant_type: variant,
        variant_description: description,
      });
    }
  }, [optimizely, whichToggle, attributes, enabled]);

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
  return useOptimizelyValue(
    (optimizely) => {
      const config = optimizely.projectConfigManager.getConfig();
      const features = config.featureFlags.map(({ key }) => {
        const enabled = optimizely.isFeatureEnabled(key, String(id), attributes);
        const forced = overrides[key];
        const setForced = (value) => setOverrides({ ...overrides, [key]: value });
        const requiresTeamMembership = TESTING_TEAM_MEMBERSHIP_REQUIRED.includes(key);
        return { key, enabled, forced, setForced, requiresTeamMembership };
      });
      return { features };
    },
    [id, attributes, overrides, setOverrides],
  );
};
