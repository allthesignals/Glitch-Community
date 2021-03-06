import { CDN_URL, EDITOR_URL, PROJECTS_DOMAIN } from 'Utils/constants';

export const FALLBACK_AVATAR_URL = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123';
export const SUSPENDED_AVATAR_URL = 'https://cdn.glitch.com/2b785d6f-8e71-423f-b484-ec2383060a9b%2Fno-entry.png?1556733100930';

export function getProjectAvatarUrl({ id, avatarUpdatedAt }) {
  return `${CDN_URL}/project-avatar/${id}.png?${avatarUpdatedAt}`;
}

export function getProjectLink({ domain }) {
  return `/~${domain}`;
}

export function getShowUrl(domain, projectsDomain = PROJECTS_DOMAIN) {
  return `//${domain}.${projectsDomain}`;
}

export function getEditorUrl(domain, path, line, character, editorUrl = EDITOR_URL) {
  if (path && Number.isInteger(line) && Number.isInteger(character)) {
    return `${editorUrl}#!/${domain}?path=${path}:${line}:${character}`;
  }
  return `${editorUrl}#!/${domain}`;
}

export function getRemixUrl(domain, editorUrl = EDITOR_URL) {
  return `${editorUrl}#!/remix/${domain}`;
}

export function sortProjectsByLastAccess(projects) {
  return projects.sort((a, b) => {
    if (a.permission.userLastAccess && b.permission.userLastAccess) {
      return Date.parse(b.permission.userLastAccess) - Date.parse(a.permission.userLastAccess);
    }
    if (a.permission.userLastAccess) {
      return -1;
    }
    if (b.permission.userLastAccess) {
      return 1;
    }
    return Date.parse(b.lastAccess) - Date.parse(a.lastAccess);
  });
}

export const MEMBER_ACCESS_LEVEL = 20;
export const ADMIN_ACCESS_LEVEL = 30;

export function humanReadableAccessLevel(accessLevel) {
  if (accessLevel === MEMBER_ACCESS_LEVEL) {
    return 'member';
  }
  if (accessLevel === ADMIN_ACCESS_LEVEL) {
    return 'admin';
  }
  return 'visitor';
}

export function userIsProjectMember({ members, user }) {
  return !!(members && members.users && members.users.some(({ id }) => id === user.id));
}

export function userIsProjectTeamMember({ project, user }) {
  if (!user || !user.teams || !project || !project.teamIds) return false;
  return project.teamIds.some((projectTeamId) => user.teams.some((userTeam) => projectTeamId === userTeam.id));
}

export function userIsProjectAdmin({ project, user }) {
  if (!user || !project) return false;
  return project.permissions.some(({ userId, accessLevel }) => user.id === userId && accessLevel >= ADMIN_ACCESS_LEVEL);
}

export function userIsOnlyProjectAdmin({ project, user }) {
  if (!user || !project) return false;
  const adminCount = project.permissions.filter((p) => p.accessLevel >= ADMIN_ACCESS_LEVEL).length;
  if (adminCount > 1) return false;
  return userIsProjectAdmin({ project, user });
}

// To be kept in sync with source/data/base-project/domains.js in the editor repo
const baseProjectIds = Object.freeze([
  '929980a8-32fc-4ae7-a66f-dddb3ae4912c',
  'a0fcd798-9ddf-42e5-8205-17158d4bf5bb',
  '640b1583-cbc9-4718-b20c-31041351c62c',
]);

export function getProjectType(project) {
  // Used for analytics.js. We categorise the type of app this is based on what it was remixed from.
  // TODO: Add baseProjectDomains as an extra check here once the backend is returning baseDomain as well as baseId for us.
  if (project.baseId === '6860ad0b-a29d-4ee1-8163-e9aee048fe60') {
    return 'gitImport';
  }
  if (baseProjectIds.includes(project.baseId)) {
    return 'starterProject';
  }
  return 'remix';
}
