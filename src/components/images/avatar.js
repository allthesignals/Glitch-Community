import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Image from 'Components/images/image';
import { CollectionDefaultAvatar } from 'Components/collection/collection-avatar';

import { CDN_URL } from 'Utils/constants';

import { DEFAULT_TEAM_AVATAR, getTeamAvatarUrl } from 'Models/team';
import { ANON_AVATAR_URL, getUserAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';

import styles from './avatar.styl';

// UserAvatar
export const AvatarBase = ({ name, src, color, srcFallback, variant, tiny, hideTooltip, withinButton }) => {
  const className = classNames(styles.avatar, styles[variant], { [styles.tiny]: tiny });
  const style = color && { backgroundColor: color };
  const contents = <Avatar src={src} defaultSrc={srcFallback} alt={name} style={style} variant={variant} className={className} />;

  if (!hideTooltip) {
    return <TooltipContainer tooltip={name} target={contents} type="action" align={['left']} fallback={withinButton} />;
  }
  return contents;
};

AvatarBase.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
  tiny: PropTypes.bool,
};

AvatarBase.defaultProps = {
  color: null,
  srcFallback: '',
  variant: 'circle',
  hideTooltip: false,
  tiny: false,
};

export const TeamAvatar = ({ team, size, hideTooltip, tiny }) => (
  <AvatarBase name={team.name} src={getTeamAvatarUrl({ ...team, size })} srcFallback={DEFAULT_TEAM_AVATAR} variant="roundrect" hideTooltip={hideTooltip} tiny={tiny} />
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
  }).isRequired,
  hideTooltip: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};
TeamAvatar.defaultProps = {
  hideTooltip: false,
  size: 'small',
};

export const UserAvatar = ({ user, suffix = '', hideTooltip, withinButton, tiny }) => (
  <AvatarBase
    name={getDisplayName(user) + suffix}
    src={getUserAvatarThumbnailUrl(user)}
    color={user.color}
    srcFallback={ANON_AVATAR_URL}
    hideTooltip={hideTooltip}
    withinButton={withinButton}
    tiny={tiny}
  />
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  suffix: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

UserAvatar.defaultProps = {
  suffix: '',
  hideTooltip: false,
  withinButton: false,
};

export const ProjectAvatar = ({ project, hasAlt, tiny }) => (
  <AvatarBase name={hasAlt ? project.domain : ''} src={getProjectAvatarUrl(project)} srcFallback={FALLBACK_AVATAR_URL} variant="roundrect" hideTooltip tiny={tiny} />
);

ProjectAvatar.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }).isRequired,
  hasAlt: PropTypes.bool,
};

ProjectAvatar.defaultProps = {
  hasAlt: false,
};

export const CollectionAvatar = ({ collection }) => (
  <CollectionDefaultAvatar color={collection.coverColor} projectCount={collection.projects.length} />
);

CollectionAvatar.propTypes = {
  collection: PropTypes.shape({
    coverColor: PropTypes.string.isRequired,
  }).isRequired,
};


export const BookmarkAvatar = ({ width, height }) => <Image src={`${CDN_URL}/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fmy-stuff-collection-avatar%20(1).svg?v=1564432130141`} alt="" width={width} height={height} />;
export const StarAvatar = ({ width, height, className }) => <Image src={`${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2FBoost%20Mark%20for%20Export.svg?v=1579101202141`} alt="" width={width} height={height} className={className} />;
