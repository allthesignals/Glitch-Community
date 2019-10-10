import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TrackedButtonGroup from 'Components/buttons/tracked-button-group';
import { SUSPENDED_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import styles from './styles.styl';

const getAvatarUrl = (currentUser, isAuthorized, project) => {
  if (project.suspendedReason && !isAuthorized && !currentUser.isSupport) {
    return SUSPENDED_AVATAR_URL;
  }
  return getProjectAvatarUrl(project);
};

const ProjectProfileContainer = ({ currentUser, project, children, avatarActions, isAuthorized }) => (
  <div className={styles.profileWrap}>
    <div className={styles.avatarContainer}>
      <div
        className={classnames(styles.avatar, styles.project)}
        style={{ backgroundImage: `url('${getAvatarUrl(currentUser, isAuthorized, project)}')` }}
      />
      <div className={styles.avatarButtons}>{avatarActions && <TrackedButtonGroup actions={avatarActions} />}</div>
    </div>
    <div className={styles.profileInfo}>{children}</div>
  </div>
);

ProjectProfileContainer.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
};

ProjectProfileContainer.defaultProps = {
  avatarActions: {},
};

export default ProjectProfileContainer;
