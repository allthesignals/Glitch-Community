import React, { useState, useCallback, useContext, createContext, useEffect } from 'react';

import useUploader from 'State/uploader';
import { useAPI, useAPIHandlers } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import * as assets from 'Utils/assets';
import { getAllPages } from 'Shared/api';
import { MEMBER_ACCESS_LEVEL, ADMIN_ACCESS_LEVEL } from 'Models/project';

async function getMembers(api, projectId, withCacheBust) {
  const cacheBust = withCacheBust ? `&cacheBust=${Date.now()}` : '';
  try {
    const [users, teams] = await Promise.all([
      getAllPages(api, `/v1/projects/by/id/users?id=${projectId}${cacheBust}`),
      getAllPages(api, `/v1/projects/by/id/teams?id=${projectId}${cacheBust}`),
    ]);
    return { users, teams };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { users: [], teams: [] };
    }
    throw error;
  }
}

const loadingResponse = { status: 'loading' };

function loadProjectMembers(api, projectIds, setProjectResponses, withCacheBust) {
  // set selected projects to 'loading' if they haven't been initialized yet
  setProjectResponses((prev) => {
    const next = { ...prev };
    for (const projectId of projectIds) {
      if (!next[projectId] || !next[projectId].members) {
        next[projectId] = { ...next[projectId], members: loadingResponse };
      }
    }
    return next;
  });
  // update each project as it loads
  projectIds.forEach(async (projectId) => {
    const members = await getMembers(api, projectId, withCacheBust);
    setProjectResponses((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        members: { status: 'ready', value: members },
      },
    }));
  });
}

export const ProjectMemberContext = createContext();
const ProjectReloadContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [projectResponses, setProjectResponses] = useState({});
  const api = useAPI();

  const getProjectMembers = useCallback(
    (projectId, deferLoading = false) => {
      if (projectResponses[projectId] && projectResponses[projectId].members) {
        return projectResponses[projectId].members;
      }
      if (!deferLoading) {
        loadProjectMembers(api, [projectId], setProjectResponses);
      }
      return loadingResponse;
    },
    [projectResponses, api],
  );

  const reloadProjectMembers = useCallback(
    (projectIds) => {
      loadProjectMembers(api, projectIds, setProjectResponses, true);
    },
    [api],
  );

  return (
    <ProjectMemberContext.Provider value={getProjectMembers}>
      <ProjectReloadContext.Provider value={reloadProjectMembers}>{children}</ProjectReloadContext.Provider>
    </ProjectMemberContext.Provider>
  );
};

export function useProjectMembers(projectId, deferLoading) {
  const getProjectMembers = useContext(ProjectMemberContext);
  return getProjectMembers(projectId, deferLoading);
}

export function useProjectReload() {
  return useContext(ProjectReloadContext);
}

export function useProjectEditor(initialProject) {
  const [project, setProject] = useState(initialProject);
  const { uploadAsset } = useUploader();
  const { handleError, handleErrorForInput, handleImageUploadError } = useErrorHandlers();
  const { getAvatarImagePolicy } = assets.useAssetPolicy();
  const { updateItem, deleteItem, updateProjectDomain, updateProjectMemberAccessLevel } = useAPIHandlers();
  useEffect(() => setProject(initialProject), [initialProject]);

  async function updateFields(changes) {
    await updateItem({ project }, changes);
    setProject((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    deleteProject: () => deleteItem({ project }).catch(handleError),
    updateDomainBackend: withErrorHandler(async (domain) => {
      await updateItem({ project }, { domain });
      // don't await this because the project domain has already changed and I don't want to delay other things updating
      updateProjectDomain({ project });
    }, handleErrorForInput),
    updateDomainState: (domain) => {
      setProject((prev) => ({
        ...prev,
        domain,
      }));
    },
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    updatePrivate: (isPrivate) => updateFields({ private: isPrivate }).catch(handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getAvatarImagePolicy({ project });
          const url = await uploadAsset(blob, policy, '', { cacheControl: 60 });
          if (!url) {
            return;
          }

          setProject((prev) => ({
            ...prev,
            avatarUpdatedAt: Date.now(),
          }));
        }, handleImageUploadError),
      ),
    reassignAdmin: async ({ currentUser, user }) => {
      await updateProjectMemberAccessLevel({ project, user, accessLevel: ADMIN_ACCESS_LEVEL });
      await updateProjectMemberAccessLevel({ project, user: currentUser, accessLevel: MEMBER_ACCESS_LEVEL });
      const newPermissions = [...project.permissions].map((permission) => {
        if (permission.userId === user.id) {
          return { ...permission, accessLevel: ADMIN_ACCESS_LEVEL };
        }
        if (permission.userId === currentUser.id) {
          return { ...permission, accessLevel: MEMBER_ACCESS_LEVEL };
        }
        return { ...permission };
      });
      const newUsers = [...project.users].map((oldUser) => {
        if (oldUser.id === user.id) {
          return { ...oldUser, permission: { ...oldUser.permission, accessLevel: ADMIN_ACCESS_LEVEL } };
        }
        if (oldUser.id === currentUser.id) {
          return { ...oldUser, permission: { ...oldUser.permission, accessLevel: MEMBER_ACCESS_LEVEL } };
        }
        return { ...oldUser };
      });
      setProject((prev) => ({ ...prev, permissions: newPermissions, users: newUsers }));
    },
  };

  return [project, funcs];
}
