import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Actions, Button, DangerZone, Icon, Info, Loader, Popover, Title } from '@fogcreek/shared-components';

import { getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnlyTeamAdmin } from 'Models/team';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserAvatar, ProjectAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import Thanks from 'Components/thanks';
import TransparentButton from 'Components/buttons/transparent-button';

import { createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { getAllPages } from 'Shared/api';
import { useTracker } from 'State/segment-analytics';

import styles from './styles.styl';
import { emoji } from '../global.styl';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const useProjects = createAPIHook(async (api, userID, team) => {
  const userProjects = await getAllPages(api, `/v1/users/by/id/projects?id=${userID}&limit=100`);
  return userProjects.filter((userProj) => team.projects.some((teamProj) => teamProj.id === userProj.id));
});

const ProjectsList = ({ options, value, onChange }) => (
  <div className={styles.projectsList}>
    {options.map((project) => (
      <label key={project.id}>
        <input
          type="checkbox"
          checked={value.includes(project.id)}
          value={project.id}
          onChange={(e) => {
            const next = new Set(value);
            if (e.target.checked) {
              next.add(e.target.value);
            } else {
              next.delete(e.target.value);
            }
            onChange(Array.from(next));
          }}
        />
        <div className={styles.projectAvatarWrap}>
          <ProjectAvatar project={project} />
        </div>
        {project.domain}
      </label>
    ))}
  </div>
);

const AdminBadge = () => (
  <div className={styles.statusBadge}>
    <TooltipContainer type="info" target={<span className={styles.adminStatus}>Team Admin</span>} tooltip="Can edit team info and billing" />
  </div>
);

// Team User Remove 💣

function TeamUserRemovePop({ user, team, onRemoveUser }) {
  const userTeamProjectsResponse = useProjects(user.id, team);
  const userTeamProjects = userTeamProjectsResponse.value || [];

  const [selectedProjectIDs, setSelectedProjects] = useState([]);
  function selectAllProjects() {
    setSelectedProjects(userTeamProjects.map((p) => p.id));
  }

  function unselectAllProjects() {
    setSelectedProjects([]);
  }

  const allProjectsSelected = userTeamProjects.every((p) => selectedProjectIDs.includes(p.id));
  const projectsToRemove = userTeamProjects.filter((p) => selectedProjectIDs.includes(p.id));

  return (
    <>
      <Title>Remove {getDisplayName(user)}</Title>

      {userTeamProjectsResponse.status !== 'ready' && (
        <Actions>
          <Loader />
        </Actions>
      )}
      {userTeamProjects.length > 0 && (
        <Actions>
          <p>Also remove them from these projects</p>
          <ProjectsList options={userTeamProjects} value={selectedProjectIDs} onChange={setSelectedProjects} />
          {userTeamProjects.length > 1 && allProjectsSelected && (
            <Button size="small" onClick={unselectAllProjects}>
              Unselect All
            </Button>
          )}
          {userTeamProjects.length > 1 && !allProjectsSelected && (
            <Button size="small" onClick={selectAllProjects}>
              Select All
            </Button>
          )}
        </Actions>
      )}

      <DangerZone>
        <Button variant="warning" size="small" onClick={() => onRemoveUser(projectsToRemove)}>
          Remove{' '}
          <span className={styles.tinyAvatar}>
            <UserAvatar user={user} withinButton />
          </span>
        </Button>
      </DangerZone>
    </>
  );
}

// Team User Info 😍

const TeamUserInfo = ({ user, team, onMakeAdmin, onRemoveAdmin, onRemoveUser, showRemoveUser }) => {
  const { currentUser } = useCurrentUser();
  const currentUserIsTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  const selectedUserIsTeamAdmin = userIsTeamAdmin({ user, team });
  const selectedUserIsOnlyAdmin = userIsOnlyTeamAdmin({ user, team });
  const teamHasOnlyOneMember = team.users.length === 1;
  const isCurrentUser = currentUser && currentUser.id === user.id;
  const currentUserHasRemovePriveleges = currentUserIsTeamAdmin || isCurrentUser;
  const canCurrentUserRemoveUser = currentUserHasRemovePriveleges && !teamHasOnlyOneMember && !selectedUserIsOnlyAdmin;

  const userTeamProjects = useProjects(user.id, team);

  // if user is a member of no projects, skip the confirm step
  const onShowOrRemoveUser = () => {
    if (userTeamProjects.status === 'ready' && userTeamProjects.value.length === 0) {
      onRemoveUser();
    } else {
      showRemoveUser();
    }
  };

  return (
    <>
      <Info>
        <div className={styles.userProfile}>
          <UserLink user={user}>
            <UserAvatar user={user} hideTooltip />
          </UserLink>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name || 'Anonymous'}</div>
            {user.login && <div className={styles.userLogin}>@{user.login}</div>}
            {selectedUserIsTeamAdmin && <AdminBadge />}
          </div>
        </div>
      </Info>
      {user.thanksCount > 0 && (
        <Info>
          <Thanks count={user.thanksCount} />
        </Info>
      )}
      {currentUserIsTeamAdmin && !selectedUserIsOnlyAdmin && (
        <Actions>
          <p>Admins can update team info, billing, and remove users</p>
          {selectedUserIsTeamAdmin ? (
            <Button size="small" variant="secondary" onClick={onRemoveAdmin}>
              Remove Admin Status <Icon className={emoji} icon="fastDown" />
            </Button>
          ) : (
            <Button size="small" variant="secondary" onClick={onMakeAdmin}>
              Make an Admin <Icon className={emoji} icon="fastUp" />
            </Button>
          )}
        </Actions>
      )}
      {canCurrentUserRemoveUser && (
        <DangerZone>
          <Button size="small" variant="warning" onClick={onShowOrRemoveUser}>
            {isCurrentUser ? 'Leave Team' : 'Remove from Team'} <Icon className={emoji} icon="wave" />
          </Button>
        </DangerZone>
      )}
    </>
  );
};

const adminStatusDisplay = (team, user) => {
  if (userIsTeamAdmin({ team, user })) {
    return ' (admin)';
  }
  return '';
};

const TeamUserPop = ({ team, user, removeUserFromTeam, updateUserPermissions }) => {
  const trackMakeAdmin = useTracker('Ownership Granted');
  const trackPermissionChange = useTracker('Permissions Changed');
  const trackRemoveUser = useTracker('Team Left');
  const { createNotification } = useNotifications();

  const removeUser = async (selectedProjects = []) => {
    await removeUserFromTeam(user, selectedProjects);
    createNotification(`${getDisplayName(user)} removed from Team`);
  };

  const onRemoveAdmin = () => {
    trackPermissionChange({
      teamId: team.id,
      teamName: team.name,
      numberProjectMembers: team.users.length,
      teamMemberId: user.id,
      permissionLevel: 'member',
    });
    updateUserPermissions(user, MEMBER_ACCESS_LEVEL);
  };
  const onMakeAdmin = () => {
    trackPermissionChange({
      teamId: team.id,
      teamName: team.name,
      numberProjectMembers: team.users.length,
      teamMemberId: user.id,
      permissionLevel: 'admin',
    });
    trackMakeAdmin({ teamId: team.id, teamName: team.name });
    updateUserPermissions(user, ADMIN_ACCESS_LEVEL);
  };

  return (
    <Popover
      align="left"
      renderLabel={({ onClick, ref }) => (
        <TransparentButton onClick={onClick} ref={ref}>
          <UserAvatar user={user} suffix={adminStatusDisplay(team, user)} withinButton />
        </TransparentButton>
      )}
      views={{
        remove: ({ onClose }) => (
          <TeamUserRemovePop
            user={user}
            team={team}
            onRemoveUser={() => {
              trackRemoveUser({ teamId: team.id, teamName: team.name });
              onClose();
              removeUser();
            }}
          />
        ),
      }}
    >
      {({ onClose, setActiveView }) => (
        <TeamUserInfo
          user={user}
          team={team}
          onRemoveAdmin={() => { onClose(); onRemoveAdmin(); }}
          onMakeAdmin={() => { onClose(); onMakeAdmin(); }}
          onRemoveUser={() => {
            trackRemoveUser({ teamId: team.id, teamName: team.name });
            onClose();
            removeUser();
          }}
          showRemoveUser={() => { setActiveView('remove'); }}
        />
      )}
    </Popover>
  );
};

TeamUserPop.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};

export default TeamUserPop;
