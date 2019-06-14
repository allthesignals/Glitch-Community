import { useState } from 'react';

import * as assets from 'Utils/assets';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';

import useErrorHandlers from '../presenters/error-handlers';
import useUploader from '../presenters/includes/uploader';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;


async function addProjectToCollection(api, project, collection) {
  await api.patch(`collections/${collection.id}/add/${project.id}`);
}

async function joinTeamProject(api, projectId, team) {
  await api.post(`/teams/${team.id}/projects/${projectId}/join`);
}

async function leaveTeamProject(api, projectId, user) {
  await api.delete(`/projects/${projectId}/authorization`, {
    data: {
      targetUserId: user.id,
    },
  });
}

export function useTeamEditor(initialTeam) {
  const api = useAPI();
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const [team, setTeam] = useState({
    ...initialTeam,
    _cacheAvatar: Date.now(),
    _cacheCover: Date.now(),
  });

  async function updateFields(changes) {
    const { data } = await api.patch(`teams/${team.id}`, changes);
    setTeam((prev) => ({ ...prev, ...data }));
    if (currentUser) {
      const teamIndex = currentUser.teams.findIndex(({ id }) => id === team.id);
      if (teamIndex >= 0) {
        const teams = [...currentUser.teams];
        teams[teamIndex] = team;
        updateCurrentUser({ teams });
      }
    }
  }

  async function uploadAvatar(blob) {
    const { data: policy } = await assets.getTeamAvatarImagePolicy(api, team.id);
    await uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
    setTeam((prev) => ({ ...prev, _cacheAvatar: Date.now() }));
  }

  async function uploadCover(blob) {
    const { data: policy } = await assets.getTeamCoverImagePolicy(api, team.id);
    await uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    setTeam((prev) => ({ ...prev, _cacheCover: Date.now() }));
  }

  async function joinTeam() {
    await api.post(`teams/${team.id}/join`);
    setTeam((prev) => ({
      ...prev,
      users: [...prev.users, currentUser],
    }));
    if (currentUser) {
      const { teams } = currentUser;
      updateCurrentUser({ teams: [...teams, team] });
    }
  }

  async function inviteEmail(emailAddress) {
    console.log('💣 inviteEmail', emailAddress);
    await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
      emailAddress,
    });
  }

  async function inviteUser(user) {
    console.log('💣 inviteUser', user);
    await api.post(`teams/${team.id}/sendJoinTeamEmail`, {
      userId: user.id,
    });
  }

  function removeUserAdmin(id) {
    const index = team.adminIds.indexOf(id);
    if (index !== -1) {
      setTeam((prev) => ({
        ...prev,
        counter: prev.adminIds.splice(index, 1),
      }));
    }
  }

  async function removeUserFromTeam(userId, projectIds) {
    // Kick them out of every project at once, and wait until it's all done
    await Promise.all(
      projectIds.map((projectId) =>
        api.delete(`projects/${projectId}/authorization`, {
          data: { targetUserId: userId },
        }),
      ),
    );
    // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
    await api.delete(`teams/${team.id}/users/${userId}`);
    removeUserAdmin(userId);
    setTeam((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== userId),
    }));
    if (currentUser && currentUser.id === userId) {
      const teams = currentUser.teams.filter(({ id }) => id !== team.id);
      updateCurrentUser({ teams });
    }
  }

  async function updateUserPermissions(id, accessLevel) {
    if (accessLevel === MEMBER_ACCESS_LEVEL && team.adminIds.length <= 1) {
      createNotification('A team must have at least one admin', { type: 'error' });
      return false;
    }
    await api.patch(`teams/${team.id}/users/${id}`, {
      access_level: accessLevel,
    });
    if (accessLevel === ADMIN_ACCESS_LEVEL) {
      setTeam((prev) => ({
        ...prev,
        counter: prev.adminIds.push(id),
      }));
    } else {
      removeUserAdmin(id);
    }
    return null;
  }

  async function addProject(project) {
    await api.post(`teams/${team.id}/projects/${project.id}`);
    setTeam((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  }

  async function removeProject(id) {
    await api.delete(`teams/${team.id}/projects/${id}`);
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }

  async function deleteProject(projectId) {
    await api.delete(`/projects/${projectId}`);
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
  }

  async function addPin(projectId) {
    await api.post(`teams/${team.id}/pinned-projects/${projectId}`);
    setTeam((prev) => ({
      ...prev,
      teamPins: [...prev.teamPins, { projectId }],
    }));
  }

  async function removePin(projectId) {
    await removePinnedPro
    setTeam((prev) => ({
      ...prev,
      teamPins: prev.teamPins.filter((p) => p.projectId !== projectId),
    }));
  }

  async function unfeatureProject() {
    await updateFields({ featured_project_id: null });
  }

  async function featureProject(id) {
    await updateFields({ featured_project_id: id });
  }

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    joinTeam: () => joinTeam().catch(handleError),
    inviteEmail: (email) => inviteEmail(email).catch(handleError),
    inviteUser: (id) => inviteUser(id).catch(handleError),
    removeUserFromTeam: (id, projectIds) => removeUserFromTeam(id, projectIds).catch(handleError),
    uploadAvatar: () => assets.requestFile((blob) => uploadAvatar(blob).catch(handleError)),
    uploadCover: () => assets.requestFile((blob) => uploadCover(blob).catch(handleError)),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: (project) => addProject(project).catch(handleError),
    removeProject: (id) => removeProject(id).catch(handleError),
    deleteProject: (id) => deleteProject(id).catch(handleError),
    addPin: (id) => addPin(id).catch(handleError),
    removePin: (id) => removePin(id).catch(handleError),
    updateWhitelistedDomain: (whitelistedDomain) => updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: (id, accessLevel) => updateUserPermissions(id, accessLevel).catch(handleError),
    joinTeamProject: (projectId) => joinTeamProject(api, projectId, team).catch(handleError),
    leaveTeamProject: (projectId) => leaveTeamProject(api, projectId, currentUser).catch(handleError),
    addProjectToCollection: (project, collection) => addProjectToCollection(api, project, collection).catch(handleCustomError),
    featureProject: (id) => featureProject(id).catch(handleError),
    unfeatureProject: (id) => unfeatureProject(id).catch(handleError),
  };
  return [team, funcs];
}
