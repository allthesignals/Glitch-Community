import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CoverContainer from 'Components/containers/cover-container';
import ProfileList from 'Components/profile-list';
import TrackedButtonGroup from 'Components/buttons/tracked-button-group';
import { getUserAvatarStyle } from 'Models/user';
import styles from './styles.styl';

const UserProfileContainer = ({ item, children, avatarActions, coverActions, teams }) => {
  const hasTeams = !!(teams && teams.length);
  return (
    <CoverContainer type="user" item={item} coverActions={coverActions}>
      <div className={classnames(styles.profileWrap, hasTeams && styles.hasTeams)}>
        <div className={styles.avatarContainer}>
          <div className={classnames(styles.avatar, styles.user)} style={getUserAvatarStyle(item)} />
          <div className={styles.avatarButtons}>{avatarActions && <TrackedButtonGroup actions={avatarActions} />}</div>
        </div>
        <div className={styles.profileInfo}>{children}</div>
      </div>
      {hasTeams && (
        <div className={styles.teamsContainer}>
          <ProfileList layout="block" teams={teams} />
        </div>
      )}
    </CoverContainer>
  );
};

UserProfileContainer.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
  coverActions: PropTypes.object,
  teams: PropTypes.array,
};

UserProfileContainer.defaultProps = {
  avatarActions: {},
  coverActions: {},
  teams: [],
};

export default UserProfileContainer;
