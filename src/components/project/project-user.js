import React from 'react';
import PropTypes from 'prop-types';
import { Popover, UnstyledButton, Info, Actions, Button, Icon } from '@fogcreek/shared-components';

import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { useTrackedFunc } from 'State/segment-analytics';

import { captureException } from 'Utils/sentry';

import { userIsProjectAdmin } from 'Models/project';

import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { emoji } from 'Components/global.styl';

import styles from './project-user.styl';

// the exanded popover where permissions change
export const PermissionsPopover = ({ user, project, reassignAdmin }) => {
  const userIsAdmin = userIsProjectAdmin({ project, user });
  const { currentUser } = useCurrentUser();
  const currentUserIsAdmin = userIsProjectAdmin({ project, user: currentUser });
  const { createNotification } = useNotifications();
  const onReassignAdmin = useTrackedFunc(
    async () => {
      try {
        await reassignAdmin({ user, currentUser });
        createNotification(`${user.name} is now the project owner`, { type: 'success' });
      } catch(error) {
        captureException(error);
        createNotification(`Sorry, we were unable to make ${user.name} the new project owner, try again later`, { type: 'error' });
      }
    },
    'Project Added to Collection',
    { origin: 'Add Project collection' },
  );
  return (
    <div className={styles.permissionsPopover}>
      <Info className={styles.permissionsPopoverInfo}>
        <UserLink user={user}>
          <UserAvatar user={user} hideTooltip />
        </UserLink>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.name || 'Anonymous'}</div>
          {user.login && <div className={styles.userLogin}>@{user.login}</div>}
          {userIsAdmin && (
            <div>
              <TooltipContainer type="info" target={<span className={styles.projectOwner}>Project Owner</span>} tooltip="Can delete project" />
            </div>
          )}
        </div>
      </Info>
      {currentUserIsAdmin && !userIsAdmin && (
        <Actions className={styles.permissionsPopoverActions}>
          <p>The project owner can delete this project</p>
          <p>Each project has a single owner, so you will lose the ability to delete this project if you are no longer the project owner</p>
          <Button size="small" variant="secondary" onClick={onReassignAdmin}>
            Make Project Owner <Icon className={emoji} icon="fastUp" alt="" />
          </Button>
        </Actions>
      )}
    </div>
  );
};
PermissionsPopover.propTypes = {
  user: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  reassignAdmin: PropTypes.func.isRequired,
};

// list of users
const ProjectUsers = ({ users, project, reassignAdmin }) => (
  <div className={styles.projectUsers}>
    {users.map((user) => (
      <Popover
        className={styles.projectUsersPopover}
        key={user.id}
        align="left"
        renderLabel={({ onClick, ref }) => (
          <UnstyledButton onClick={onClick} ref={ref}>
            <UserAvatar user={user} hideTooltip />
          </UnstyledButton>
        )}
      >
        {({ onClose, setActiveView }) => (
          <PermissionsPopover onClose={onClose} setActiveView={setActiveView} user={user} project={project} reassignAdmin={reassignAdmin} />
        )}
      </Popover>
    ))}
  </div>
);

ProjectUsers.propTypes = {
  users: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  reassignAdmin: PropTypes.func.isRequired,
};

export default ProjectUsers;
