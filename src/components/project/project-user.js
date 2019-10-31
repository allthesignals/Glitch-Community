import React from 'react';
import { Popover, UnstyledButton, Info, Actions, Button, Icon } from '@fogcreek/shared-components';

import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers } from 'State/api';

import { userIsProjectAdmin, MEMBER_ACCESS_LEVEL, ADMIN_ACCESS_LEVEL } from 'Models/project';

import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { emoji } from 'Components/global.styl';

import styles from './project-user.styl';

const AdminBadge = () => (
  <div>
    <TooltipContainer type="info" target={<span>Project Owner</span>} tooltip="Can delete project" />
  </div>
);

// the exanded popover where permissions change
const PermissionsPopover = ({ user, project }) => {
  const userIsAdmin = userIsProjectAdmin({ project, user });
  const { currentUser } = useCurrentUser();
  const currentUserIsAdmin = userIsProjectAdmin({ project, user: currentUser });
  const { updateProjectMemberAccessLevel } = useAPIHandlers();
  const onMakeAdmin = async () => {
    await updateProjectMemberAccessLevel({ project, user, accessLevel: ADMIN_ACCESS_LEVEL });
    await updateProjectMemberAccessLevel({ project, user: currentUser, accessLevel: MEMBER_ACCESS_LEVEL });
  };

  return (
    <>
      <Info>
        <div className={styles.permissionsPopover}>
          <UserLink user={user}>
            <UserAvatar user={user} hideTooltip />
          </UserLink>
          <div>
            <div>{user.name || 'Anonymous'}</div>
            {user.login && <div>@{user.login}</div>}
            {userIsAdmin && <AdminBadge />}
          </div>
        </div>
      </Info>
      {currentUserIsAdmin && !userIsAdmin && (
        <Actions>
          <p>The project owner can delete this project</p>
          <p>Each project has a single owner, so you will lose the ability to delete this project if you are no longer the project owner</p>
          <Button size="small" variant="secondary" onClick={onMakeAdmin}>
            Make Admin <Icon className={emoji} icon="fastUp" />
          </Button>
        </Actions>
      )}
    </>
  );
};

// the button
const ProjectUserPop = ({ user, project }) => (
  <Popover
    align="left"
    renderLabel={({ onClick, ref }) => (
      <UnstyledButton onClick={onClick} ref={ref}>
        <UserAvatar user={user} />
      </UnstyledButton>
    )}
    views={{ /* nameOfNestedPop: ({ onClose }) => <div>nested view example</div> */}}
  >
    {({ onClose, setActiveView }) => <PermissionsPopover onClose={onClose} setActiveView={setActiveView} user={user} project={project} />}
  </Popover>
);

// the list
const ProjectUsers = ({ users, project }) => (
  <div>
    {users.map((user) => (
      <ProjectUserPop user={user} key={user.id} project={project} />
    ))}
  </div>
);

export default ProjectUsers;
