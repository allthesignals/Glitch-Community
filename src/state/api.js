import React, { useState, useEffect, useContext, useRef, useMemo, createContext } from 'react';
import axios from 'axios';
import { memoize } from 'lodash';
import { API_URL } from 'Utils/constants';
import { captureException } from 'Utils/sentry';
import { useCurrentUser } from './current-user'; // eslint-disable-line import/no-cycle

export const Context = createContext();

export const getAPIForToken = memoize((persistentToken) => {
  const cache = {};
  const maxAge = 60 * 1000;
  let api;
  if (persistentToken) {
    api = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  } else {
    api = axios.create({
      baseURL: API_URL,
    });
  }

  return {
    ...api,
    persistentToken,
    get: (url, config) => {
      // TODO: support params
      if (config) return api.get(url, config);
      const now = Date.now();
      if (cache[url] && cache[url].timestamp + maxAge > now) {
        return cache[url].response;
      }
      const response = api.get(url);
      cache[url] = {
        timestamp: now,
        response,
      };
      return response;
    },
    // bustCache is a bandaid for now to handle stale data after an update,
    // in the future we should have a more sophisticated caching layer
    // that can understand when data expires after a post/patch/delete request
    bustCache: (url) => {
      if (cache && cache[url]) {
        cache[url].timestamp = 0;
      }
    },
  };
});

export function APIContextProvider({ children }) {
  const { persistentToken } = useCurrentUser();
  const [pendingRequests, setPendingRequests] = useState([]);

  const api = useMemo(() => {
    const rawApi = getAPIForToken(persistentToken);
    if (rawApi.persistentToken) return rawApi;
    // stall requests until we have a persistentToken
    const overrides = {};
    ['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
      overrides[method] = async (...args) => {
        const apiWithToken = await new Promise((resolve) => {
          setPendingRequests((latestPendingRequests) => [...latestPendingRequests, resolve]);
        });
        return apiWithToken[method](...args);
      };
    });
    return { ...rawApi, ...overrides };
  }, [persistentToken]);

  useEffect(() => {
    if (api.persistentToken && pendingRequests.length) {
      // go back and finally make all of those requests
      pendingRequests.forEach((request) => request(api));
      setPendingRequests((latestPendingRequests) => latestPendingRequests.filter((request) => !pendingRequests.includes(request)));
    }
  }, [api, pendingRequests]);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}

/*
Create a hook for working with the API via async functions.
Usage:

const useTeamsAPI = createAPIHook(async (api, teamID) => {
  const team = await api.get(`/team/${teamID}`);
  const { projectIDs } = team;
  team.projects = await Promise.all(projectIDs.map(projectID => api.get(`/project/${projectID})`));
  return team;
});

function TeamWithProjects ({ teamID }) {
  const { status, value } = useTeamsAPI(teamID)

  if (status === 'loading') {
    return <Loading />
  }

  // ... render the team ...
}

*/

// we don't want to set "stale" state, e.g. if the user clicks over to a different team's page
// while the first team's data is still loading, we don't want to show the first team's data when it loads.
// this should also avoid errors from setting state on an unmounted component.
function useAsyncEffectState(initialState, handler, asyncFuncArgs) {
  const [state, setState] = useState(initialState);
  const versionRef = useRef(0);
  useEffect(() => {
    const versionWhenEffectStarted = versionRef.current;
    const setStateIfFresh = (value) => {
      if (versionWhenEffectStarted === versionRef.current) {
        setState(value);
      }
    };
    handler(setStateIfFresh, versionWhenEffectStarted);
    return () => {
      versionRef.current += 1;
    };
  }, asyncFuncArgs);
  return state;
}

export const createAPIHook = (asyncFunction, options = {}) => (...args) => {
  const api = useAPI();
  const loading = { status: 'loading' };
  const result = useAsyncEffectState(
    loading,
    async (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      try {
        const value = await asyncFunction(api, ...args);
        setResult({ status: 'ready', value });
      } catch (error) {
        setResult({ status: 'error', error });
        if (options.captureException) {
          captureException(error);
        }
      }
    },
    args,
  );
  return result;
};

export const entityPath = ({ user, team, project, collection }) => {
  if (user) return `v1/users/${user.id}`;
  if (team) return `v1/teams/${team.id}`;
  if (project) return `v1/projects/${project.id}`;
  if (collection) return `v1/collections/${collection.id}`;
  throw new Error('Missing entity');
};

export const useAPIHandlers = () => {
  const api = useAPI();
  return useMemo(
    () => ({
      // all entities
      updateItem: (entityArgs, changes) => api.patch(`/${entityPath(entityArgs)}`, changes),
      deleteItem: (entityArgs) => api.delete(`/${entityPath(entityArgs)}`),

      // collections
      addProjectToCollection: ({ project, collection }) => api.put(`/v1/collections/${collection.id}/projects/${project.id}`),
      orderProjectInCollection: ({ project, collection }, index) => api.put(`/v1/collections/${collection.id}/projects/${project.id}`, { index }),
      updateProjectInCollection: ({ project, collection }, data) => api.put(`/v1/collections/${collection.id}/projects/${project.id}`, data),
      removeProjectFromCollection: ({ project, collection }) => api.delete(`/v1/collections/${collection.id}/projects/${project.id}`),

      // projects
      removeUserFromProject: ({ project, user }) => api.delete(`/v1/projects/${project.id}/users/${user.id}`),
      updateProjectDomain: ({ project }) => api.post(`/project/domainChanged?projectId=${project.id}`),
      undeleteProject: ({ project }) => api.post(`/v1/projects/${project.id}/undelete`),
      updateProjectMemberAccessLevel: ({ project, user, accessLevel }) => api.put(`v1/projects/${project.id}/users/${user.id}`, { accessLevel }),

      // teams
      joinTeam: ({ team }) => api.post(`/v1/teams/${team.id}/join`),
      inviteEmailToTeam: ({ team }, emailAddress) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { emailAddress }),
      inviteUserToTeam: ({ team, user }) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { userId: user.id }),
      revokeTeamInvite: ({ team, user }) => api.delete(`/v1/teams/${team.id}/tokens/${user.id}`),
      updateUserAccessLevel: ({ user, team }, accessLevel) => api.put(`/v1/teams/${team.id}/users/${user.id}`, { accessLevel }),
      removeUserFromTeam: ({ user, team }) => api.delete(`/v1/teams/${team.id}/users/${user.id}`),
      addProjectToTeam: ({ project, team }) => api.put(`/v1/teams/${team.id}/projects/${project.id}`),
      removeProjectFromTeam: ({ project, team }) => api.delete(`/v1/teams/${team.id}/projects/${project.id}`),
      joinTeamProject: ({ project, team }) => api.put(`/v1/teams/${team.id}/projects/${project.id}/join`),

      // teams / users
      addPinnedProject: ({ project, team, user }) => api.put(`/${entityPath({ team, user })}/pinnedProjects/${project.id}`),
      removePinnedProject: ({ project, team, user }) => api.delete(`/${entityPath({ team, user })}/pinnedProjects/${project.id}`),

      // account closure
      removeUserWithToken: (token) => api.delete(`/v1/users?token=${token}`),
      requestAccountDeleteEmail: (user) => api.post(`/v1/users/${user.id}/requestDeletion`),

      // Glitch PRO
      // TODO: v1/payments/glitchPro -> v1/payments/:productName
      getSubscriptionStatus: () => api.get('/v1/payments/glitchPro'),
      createSubscriptionSession: ({ successUrl, cancelUrl }) => api.post('/v1/payments/glitchPro', { successUrl, cancelUrl }),
      cancelSubscription: () => api.delete('/v1/payments/glitchPro'),
    }),
    [api],
  );
};
