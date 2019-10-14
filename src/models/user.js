import { CDN_URL } from 'Utils/constants';

export const ANON_AVATAR_URL = 'https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399';

export const lightColors = ['#FFC761', '#9BFFB5', '#FF9BA1', '#9B9EFF'];

export function getDisplayName({ login, name }) {
  if (name) {
    return name;
  }
  if (login) {
    return `@${login}`;
  }
  return 'Anonymous User';
}

export function getUserLink({ id, login }) {
  if (login) {
    return `/@${login}`;
  }
  return `/user/${id}`;
}

export function getUserAvatarUrl({ login, avatarUrl }) {
  if (login && avatarUrl) {
    return avatarUrl;
  }
  return ANON_AVATAR_URL;
}

export function getUserAvatarThumbnailUrl({ login, avatarThumbnailUrl }) {
  if (login && avatarThumbnailUrl) {
    return avatarThumbnailUrl;
  }
  return ANON_AVATAR_URL;
}

export function getUserAvatarStyle(user, size) {
  const { avatarUrl, avatarThumbnailUrl, color } = user;
  const url = size === 'small' ? avatarThumbnailUrl : avatarUrl;
  return {
    backgroundColor: color,
    backgroundImage: `url('${url || ANON_AVATAR_URL}')`,
  };
}

export function getUserCoverUrl({ id, hasCoverImage, updatedAt, size = 'large', useDefaultImage = false }) {
  const customImage = `${CDN_URL}/user-cover/${id}/${size}?${updatedAt}`;
  const defaultImage = 'https://cdn.glitch.com/b065beeb-4c71-4a9c-a8aa-4548e266471f%2Fuser-pattern.svg';
  return hasCoverImage && !useDefaultImage ? customImage : defaultImage;
}

export function getUserProfileStyle(params, type = '') {
  // five random light colors from randomcolor
  return {
    backgroundColor: lightColors[params.id % 4],
    backgroundImage: `url('${getUserCoverUrl(params, type === 'dashboard')}')`,
  };
}
