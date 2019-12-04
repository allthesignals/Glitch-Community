import { useState, useEffect } from 'react';

import * as assets from 'Utils/assets';

import { useAPIHandlers, createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import useUploader from 'State/uploader';
import useErrorHandlers from 'State/error-handlers';
import { useProjectReload } from 'State/project';

import { MEMBER_ACCESS_LEVEL, userIsOnlyTeamAdmin } from 'Models/team';
import { captureException } from 'Utils/sentry';

export const useTeamMembers = createAPIHook(async (api, teamID) => {
  try {
    const res = await api.get(`/v1/teams/by/id/users?id=${teamID}&limit=10`);
    return res.data.items;
  } catch (e) {
    captureException(e);
    return [];
  }
});

// eslint-disable-next-line import/prefer-default-export
export function useTeamEditor(initialTeam) {
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleImageUploadError } = useErrorHandlers();
  const { getAvatarImagePolicy, getCoverImagePolicy } = assets.useAssetPolicy();
  const reloadProjectMembers = useProjectReload();
  const {
    updateItem,
    deleteItem,
    joinTeam,
    inviteEmailToTeam,
    inviteUserToTeam,
    removeUserFromProject,
    removeUserFromTeam,
    addProjectToTeam,
    removeProjectFromTeam,
    addPinnedProject,
    removePinnedProject,
    updateUserAccessLevel,
    joinTeamProject,
  } = useAPIHandlers();
  const [team, setTeam] = useState(initialTeam);

  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  async function updateFields(changes) {
    const { data } = await updateItem({ team }, changes);
    setTeam((prev) => ({ ...prev, ...data }));
    if (currentUser) {
      const teamIndex = currentUser.teams.findIndex(({ id }) => id === team.id);
      if (teamIndex >= 0) {
        const teams = [...currentUser.teams];
        teams[teamIndex] = { ...currentUser.teams[teamIndex], ...changes };
        updateCurrentUser({ teams });
      }
    }
  }

  function updatePermissions(project, permissions) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== project.id) return p;
        return {
          ...p,
          permissions,
        };
      }),
    }));
  }

  function removePermissions(user, projects) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (!projects.some((project) => project.id === p.id)) return p;
        return {
          ...p,
          permissions: p.permissions.filter((perm) => perm.userId !== user.id),
        };
      }),
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    deleteTeam: withErrorHandler(async () => {
      await deleteItem({ team });
      const teams = currentUser.teams.filter((t) => t.id !== team.id);
      updateCurrentUser({ teams });
    }, handleError),
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    joinTeam: withErrorHandler(async () => {
      await joinTeam({ team });
      setTeam((prev) => ({
        ...prev,
        teamPermissions: [...prev.teamPermissions, { accessLevel: MEMBER_ACCESS_LEVEL, userId: currentUser.id }],
        users: [...prev.users, currentUser],
      }));
      if (currentUser) {
        const { teams } = currentUser;
        updateCurrentUser({ teams: [...teams, team] });
      }
    }, handleError),
    inviteEmail: (email) => inviteEmailToTeam({ team }, email),
    inviteUser: (user) => inviteUserToTeam({ user, team }),
    removeUserFromTeam: withErrorHandler(async (user, projects) => {
      // Kick them out of every project at once, and wait until it's all done
      await Promise.all(projects.map((project) => removeUserFromProject({ project, user })));
      // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
      await removeUserFromTeam({ user, team });
      setTeam((prev) => ({
        ...prev,
        teamPermissions: prev.teamPermissions.filter((p) => p.userId !== user.id),
        users: prev.users.filter((u) => u.id !== user.id),
      }));
      if (currentUser && currentUser.id === user.id) {
        const teams = currentUser.teams.filter(({ id }) => id !== team.id);
        updateCurrentUser({ teams });
      }
      // update projects so that this user no longer appears in member lists
      reloadProjectMembers(projects.map((project) => project.id));
      removePermissions(user, projects);
    }, handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getAvatarImagePolicy({ team });
          const success = await uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);
          if (!success) {
            return;
          }

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasAvatarImage: true,
            backgroundColor: color,
          });
          setTeam((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleImageUploadError),
      ),
    uploadCover: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getCoverImagePolicy({ team });
          const success = await uploadAssetSizes(blob, policy, assets.COVER_SIZES);
          if (!success) {
            return;
          }

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasCoverImage: true,
            coverColor: color,
          });
          setTeam((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleImageUploadError),
      ),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: withErrorHandler(async (project) => {
      await addProjectToTeam({ project, team });
      setTeam((prev) => ({
        ...prev,
        projects: [project, ...prev.projects],
      }));
      reloadProjectMembers([project.id]);
    }, handleError),
    removeProjectFromTeam: withErrorHandler(async (project) => {
      await removeProjectFromTeam({ project, team });
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
      reloadProjectMembers([project.id]);
    }, handleError),
    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    addPin: withErrorHandler(async (project) => {
      await addPinnedProject({ project, team });
      setTeam((prev) => ({
        ...prev,
        pinnedProjects: [...prev.pinnedProjects, project],
      }));
    }, handleError),
    removePin: withErrorHandler(async (project) => {
      await removePinnedProject({ project, team });
      setTeam((prev) => ({
        ...prev,
        pinnedProjects: prev.pinnedProjects.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    updateWhitelistedDomain: (whitelistedDomain) => updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: withErrorHandler(async (user, accessLevel) => {
      if (accessLevel === MEMBER_ACCESS_LEVEL && userIsOnlyTeamAdmin({ user, team })) {
        createNotification('A team must have at least one admin', { type: 'error' });
        return false;
      }
      await updateUserAccessLevel({ user, team }, accessLevel);
      let teamPermissions;
      setTeam((prev) => {
        teamPermissions = prev.teamPermissions.map((perm) => (perm.userId === user.id ? { ...perm, accessLevel } : perm));
        return { ...prev, teamPermissions };
      });
      const newTeams = [];
      currentUser.teams.forEach((t) => {
        const newTeam = { ...t };
        if (newTeam.id === team.id) {
          newTeam.teamPermissions = teamPermissions;
          if (user.id === currentUser.id) {
            newTeam.teamPermission = Object.assign({}, newTeam.teamPermission, { accessLevel });
          }
        }
        newTeams.push(newTeam);
      });
      updateCurrentUser({ teams: newTeams });
      return null;
    }, handleError),
    joinTeamProject: withErrorHandler(async (project) => {
      const { data: updatedProject } = await joinTeamProject({ team, project });
      updatePermissions(project, updatedProject.users.map((user) => user.projectPermission));
      reloadProjectMembers([project.id]);
    }, handleError),
    leaveProject: withErrorHandler(async (project) => {
      await removeUserFromProject({ project, user: currentUser });
      removePermissions(currentUser, [project]);
      reloadProjectMembers([project.id]);
    }, handleError),
    featureProject: (project) => updateFields({ featured_project_id: project.id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [team, funcs];
}
