import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TrackedButtonGroup from 'Components/buttons/tracked-button-group';
import { getProjectAvatarUrl } from 'Models/project';
import styles from './styles.styl';

const suspendedAvatarUrl = 'https://cdn.glitch.com/2b785d6f-8e71-423f-b484-ec2383060a9b%2Fno-entry.png?1556733100930';

const getAvatarUrl = (currentUser, isAuthorized, project) => {
  if (project.suspendedReason && !isAuthorized && !currentUser.isSupport) {
    return suspendedAvatarUrl;
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
