import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnlyTeamAdmin } from 'Models/team';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import { UserAvatar } from 'Components/images/avatar';
import Thanks from 'Components/thanks';
import { PopoverDialog, PopoverWithButton, PopoverActions, PopoverInfo, MultiPopover } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';

import { useTrackedFunc } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import { useNotifications } from '../notifications';
import TeamUserRemovePop from './team-user-remove-pop';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
};

// Remove from Team 👋

const RemoveFromTeam = ({ onRemove }) => (
  <PopoverActions type="dangerZone">
    <Button type="dangerZone" onClick={onRemove}>
      Remove from Team <Emoji name="wave" />
    </Button>
  </PopoverActions>
);

// Admin Actions Section ⏫⏬

const AdminActions = ({ isTeamAdmin, onClickRemoveAdmin, onClickMakeAdmin }) => (
  <PopoverActions>
    <ActionDescription>Admins can update team info, billing, and remove users</ActionDescription>
    {isTeamAdmin ? (
      <Button size="small" type="tertiary" onClick={onClickRemoveAdmin}>
        Remove Admin Status <Emoji name="fast-down"/>
      </Button>
    ) : (
      <Button size="small" type="tertiary" onClick={onClickRemoveAdmin}>
        Make an Admin <Emoji name="fast-up" />
      </Button>
    )}
  </PopoverActions>
);

// Team User Info 😍

const TeamUserInfo = ({ user, team, updateUserPermissions, onRemove }) => {
  const { currentUser } = useCurrentUser();
  const onRemoveTracked = useTrackedFunc(onRemove, 'Remove from Team clicked');
  const onClickRemoveAdmin = useTrackedFunc(() => updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL), 'Remove Admin Status clicked');
  const onClickMakeAdmin = useTrackedFunc(() => updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL), 'Make an Admin clicked');


  const userAvatarStyle = { backgroundColor: user.color };

  const currentUserIsTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  const selectedUserIsTeamAdmin = userIsTeamAdmin({ user, team });
  const selectedUserIsOnlyAdmin = userIsOnlyTeamAdmin({ user, team });
  const teamHasOnlyOneMember = team.users.length === 1;

  const currentUserHasRemovePriveleges = currentUserIsTeamAdmin || (currentUser && currentUser.id === user.id);
  const canCurrentUserRemoveUser = currentUserHasRemovePriveleges && !teamHasOnlyOneMember && !selectedUserIsOnlyAdmin;

  return (
    <PopoverDialog align="left">
      <PopoverInfo>
        <UserLink user={user}>
          <img className="avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={userAvatarStyle} />
        </UserLink>
        <div className="info-container">
          <p className="name" title={user.name}>
            {user.name || 'Anonymous'}
          </p>
          {user.login && (
            <p className="user-login" title={user.login}>
              @{user.login}
            </p>
          )}
          {selectedUserIsTeamAdmin && (
            <div className="status-badge">
              <TooltipContainer
                id={`admin-badge-tooltip-${user.login}`}
                type="info"
                target={<span className="status admin">Team Admin</span>}
                tooltip="Can edit team info and billing"
              />
            </div>
          )}
        </div>
      </PopoverInfo>
      {user.thanksCount > 0 && (
        <PopoverInfo>
          <ThanksCount count={user.thanksCount} />
        </PopoverInfo>
      )}
      {currentUserIsTeamAdmin && !selectedUserIsOnlyAdmin && <AdminActions isTeamAdmin={selectedUserIsTeamAdmin} onClickRemoveAdmin={onClickRemoveAdmin} onClickMakeAdmin={onClickMakeAdmin} />}
      {canCurrentUserRemoveUser && <RemoveFromTeam onRemove={onRemoveTracked} />}
    </PopoverDialog>
  );
};

// Team User Remove 💣

// Team User Info or Remove
// uses removeTeamUserVisible state to toggle between showing user info and remove views

const TeamUserInfoAndRemovePop = ({ user, team, removeUserFromTeam, updateUserPermissions }) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const [userTeamProjects, setUserTeamProjects] = useState({ status: 'loading', data: null });
  useEffect(() => {
    api.get(`users/${user.id}`).then(({ data }) => {
      setUserTeamProjects({
        status: 'ready',
        data: data.projects.filter((userProj) => team.projects.some((teamProj) => teamProj.id === userProj.id)),
      });
    });
  }, [user.id]);

  async function removeUser(selectedProjects = []) {
    await removeUserFromTeam(user.id, Array.from(selectedProjects));
    createNotification(`${getDisplayName(user)} removed from Team`);
  }
  
  // if user is a member of no projects, skip the confirm step
  const onRemove = (showRemove) => {
    if (userTeamProjects.status === 'ready' && userTeamProjects.data.length === 0) {
      removeUser();
    } else {
      showRemove();
    }
  }

  return (
    <MultiPopover
      views={{
        remove: () => (
          <TeamUserRemovePop
            user={user}
            removeUser={removeUser}
            userTeamProjects={userTeamProjects}
          />
        )
      }}
    >
      {(showViews) => (
        <TeamUserInfo
          user={user}
          team={team}
          updateUserPermissions={updateUserPermissions}
          onRemove={() => onRemove(showViews.remove)}
          showRemove={showViews.remove}
        />
      )}
    </MultiPopover>
  );
};

TeamUserInfoAndRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    color: PropTypes.string,
  }).isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired,
  }).isRequired,
};

const TeamUserPop = ({ team, user, removeUserFromTeam, updateUserPermissions }) => (
  <PopoverWithButton
    buttonText={<UserAvatar user={user} suffix={adminStatusDisplay(team.adminIds, user)} withinButton />}
  >
    {({ toggleAndCall, focusFirstElement }) => (
      <TeamUserInfoAndRemovePop
        team={team}
        removeUserFromTeam={removeUserFromTeam}
        user={user}
        updateUserPermissions={updateUserPermissions}
      />
    )}
  </PopoverWithButton>
);

TeamUserPop.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};


export default TeamUserPop;
