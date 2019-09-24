import { lightColors } from 'Models/user';
import { CDN_URL, tagline } from 'Utils/constants';

export const MEMBER_ACCESS_LEVEL = 20;
export const ADMIN_ACCESS_LEVEL = 30;

export const DEFAULT_TEAM_AVATAR = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819';

export const getTeamLink = ({ url }) => `/@${url}`;

export const getTeamAvatarUrl = ({ id, hasAvatarImage, updatedAt, size = 'large' }) => {
  const customImage = `${CDN_URL}/team-avatar/${id}/${size}?${updatedAt}`;
  return hasAvatarImage ? customImage : DEFAULT_TEAM_AVATAR;
};

export const getTeamAvatarStyle = (team) => {
  const image = getTeamAvatarUrl(team);
  if (team.hasAvatarImage) {
    return {
      backgroundImage: `url('${image}')`,
    };
  }
  return {
    backgroundColor: team.backgroundColor,
    backgroundImage: `url('${image}')`,
  };
};

export const getTeamCoverUrl = ({ id, hasCoverImage, updatedAt, size = 'large' }) => {
  const customImage = `${CDN_URL}/team-cover/${id}/${size}?${updatedAt}`;
  const defaultImage = 'https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fteam-cover-pattern.svg?v=1559853406967';
  return hasCoverImage ? customImage : defaultImage;
};

export const getTeamProfileStyle = (team) => {
  const image = getTeamCoverUrl(team);
  return {
    backgroundColor: lightColors[team.id % 4],
    backgroundImage: `url('${image}')`,
  };
};

export function teamAdmins({ team }) {
  const admins = team.teamPermissions.filter(({ accessLevel }) => accessLevel === ADMIN_ACCESS_LEVEL);
  return admins.map(({ userId }) => team.users.find((user) => user.id === userId));
}

export function userIsOnTeam({ user, team }) {
  return !!user && !!team && !!team.teamPermissions && team.teamPermissions.some(({ userId }) => user.id === userId);
}

export function userCanJoinTeam({ user, team }) {
  if (!user || !user.emails || !team.whitelistedDomain || userIsOnTeam({ user, team })) return false;
  return user.emails.some(({ email, verified }) => verified && email.endsWith(`@${team.whitelistedDomain}`));
}

export function userIsTeamAdmin({ user, team }) {
  return !!user && team.teamPermissions.some(({ userId, accessLevel }) => userId === user.id && accessLevel === ADMIN_ACCESS_LEVEL);
}

export function userIsOnlyTeamAdmin({ user, team }) {
  if (!userIsTeamAdmin({ user, team })) return false;
  return !team.teamPermissions.some(({ userId, accessLevel }) => userId !== user.id && accessLevel === ADMIN_ACCESS_LEVEL);
}
