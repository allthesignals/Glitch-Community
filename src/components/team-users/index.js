import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';
import { Actions, Button, DangerZone, Icon, Info, Popover } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { getDisplayName } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import { useAPI, useAPIHandlers } from 'State/api';
import { useNotifications } from 'State/notifications';
import AddTeamUserPop from 'Components/team-users/add-team-user';
import TransparentButton from 'Components/buttons/transparent-button';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import { captureException } from 'Utils/sentry';

import TeamUserPop from './team-user-info';
import styles from './styles.styl';
import { emoji } from '../global.styl';

// Invited user icon and pop

function InvitedUser({ user, team, onRevokeInvite }) {
  const { inviteUserToTeam } = useAPIHandlers();
  const { createNotification } = useNotifications();

  // resend the invite
  const resendInvite = async () => {
    try {
      await inviteUserToTeam({ team, user });
      createNotification(`Resent invite to ${user.name}!`, { type: 'success' });
    } catch (error) {
      captureException(error);
      createNotification('Invite not sent, try again later', { type: 'error' });
    }
  };

  return (
    <Popover
      align="left"
      renderLabel={({ onClick, ref }) => (
        <TransparentButton onClick={onClick} ref={ref}>
          <UserAvatar user={user} />
        </TransparentButton>
      )}
    >
      {() => (
        <>
          <Info>
            <div className={styles.avatar}>
              <UserLink user={user}>
                <UserAvatar user={user} hideTooltip />
              </UserLink>
            </div>
            <div className={styles.nameLoginWrap}>
              <h3 className={styles.name} title={user.name}>
                {user.name || 'Anonymous'}
              </h3>
              {user.login && (
                <p className={styles.userLogin} title={user.login}>
                  @{user.login}
                </p>
              )}
            </div>
          </Info>

          <Actions>
            <Button onClick={resendInvite} variant="secondary" size="small">
              Resend invite <Icon className={emoji} icon="herb" />
            </Button>
          </Actions>

          <DangerZone>
            <Button onClick={onRevokeInvite} variant="warning" size="small">
              Remove <Icon className={emoji} icon="wave" />
            </Button>
          </DangerZone>
        </>
      )}
    </Popover>
  );
}

InvitedUser.propTypes = {
  user: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  onRevokeInvite: PropTypes.func.isRequired,
};

// Whitelisted domain icon

const WhitelistedDomain = ({ domain, setDomain }) => (
  <Popover
    align="left"
    renderLabel={({ visible, onClick, ref }) => (
      <TransparentButton onClick={onClick} ref={ref}>
        <TooltipContainer
          type="action"
          tooltip={visible ? null : `Anyone with an @${domain} email can join`}
          target={
            <div className={styles.whitelistedDomainIconWrap}>
              <WhitelistedDomainIcon domain={domain} />
            </div>
          }
        />
      </TransparentButton>
    )}
  >
    {() => (
      <>
        <Info>Anyone with an @{domain} email can join</Info>
        {!!setDomain && (
          <DangerZone>
            <Button variant="warning" size="small" onClick={() => setDomain(null)}>
              Remove {domain} <Icon className={emoji} icon="bomb" />
            </Button>
          </DangerZone>
        )}
      </>
    )}
  </Popover>
);

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};

WhitelistedDomain.defaultProps = {
  setDomain: null,
};

// Join Team

const JoinTeam = ({ onClick }) => (
  <Button size="small" variant="cta" onClick={onClick}>
    Join Team
  </Button>
);

const useInvitees = (team, currentUserIsOnTeam) => {
  const api = useAPI();
  const [tokens, setTokens] = useState(team.tokens || []);
  const [users, setUsers] = useState({});

  const loadUsers = async (userIds) => {
    const neededUsers = userIds.map(({ userId }) => userId).filter((id) => users[id] === undefined);
    if (neededUsers.length) {
      setUsers((oldUsers) => neededUsers.reduce((accumUsers, id) => ({ [id]: null, ...accumUsers }), oldUsers));
      const idString = neededUsers.map((id) => `id=${id}`).join('&');
      const { data } = await api.get(`v1/users/by/id?${idString}`);
      setUsers((oldUsers) => ({ ...oldUsers, ...data }));
    }
  };

  // watch for changes to the team and update tokens
  useEffect(() => {
    setTokens(team.tokens || []);
  }, [team.tokens]);

  // watch for changes to tokens and load new users
  useEffect(() => {
    loadUsers(tokens);
  }, [tokens]);

  const invitees = tokens
    .map(({ userId }) => users[userId])
    .filter((user) => !!user)
    .reverse();

  const addInvitee = (user) => {
    setUsers((oldUsers) => ({ ...oldUsers, [user.id]: user }));
    setTokens((oldTokens) => [{ userId: user.id }, ...oldTokens]);
  };

  const removeInvitee = (id) => {
    setTokens((oldTokens) => oldTokens.filter(({ userId }) => userId !== id));
  };

  const reloadInvitees = async () => {
    const { data } = await api.get(`v1/teams/by/id?id=${team.id}`);
    if (data[team.id]) {
      const newTokens = data[team.id].tokens || [];
      await loadUsers(newTokens);
      setTokens(newTokens);
    }
  };

  useEffect(() => {
    reloadInvitees();
  }, [currentUserIsOnTeam]);

  return [currentUserIsOnTeam ? invitees : [], addInvitee, removeInvitee, reloadInvitees];
};

const TeamUserContainer = ({ team, removeUserFromTeam, updateUserPermissions, updateWhitelistedDomain, inviteEmail, inviteUser, joinTeam }) => {
  const { currentUser } = useCurrentUser();
  const { revokeTeamInvite } = useAPIHandlers();
  const { createNotification } = useNotifications();

  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });
  const currentUserCanJoinTeam = userCanJoinTeam({ team, user: currentUser });
  const [invitees, addInvitee, removeInvitee, reloadInvitees] = useInvitees(team, currentUserIsOnTeam);
  const members = uniq([...team.users, ...invitees].map((user) => user.id));

  const onInviteUser = async (user) => {
    addInvitee(user);
    try {
      await inviteUser(user);
      createNotification(`Invited ${getDisplayName(user)}!`, { type: 'success' });
    } catch (error) {
      reloadInvitees();
      captureException(error);
      createNotification(`Couldn't invite ${getDisplayName(user)}, Try again later`, { type: 'error' });
    }
  };

  const onInviteEmail = async (email) => {
    addInvitee({ id: 0, name: email });
    try {
      await inviteEmail(email);
      createNotification(`Invited ${email}!`, { type: 'success' });
      reloadInvitees();
    } catch (error) {
      reloadInvitees();
      captureException(error);
      createNotification(`Couldn't invite ${email}, Try again later`, { type: 'error' });
    }
  };

  return (
    <ul className={styles.container}>
      {team.users.map((user) => (
        <li key={user.id} className={styles.teamMember}>
          <TeamUserPop team={team} user={user} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
        </li>
      ))}
      {!!team.whitelistedDomain && (
        <li className={styles.whitelistedDomain}>
          <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
        </li>
      )}
      {invitees.map((user) => (
        <li key={user.id} className={styles.invitedMember}>
          <InvitedUser
            user={user}
            team={team}
            onRevokeInvite={async () => {
              removeInvitee(user.id);
              try {
                await revokeTeamInvite({ team, user });
                createNotification(`Removed ${user.name} from team`);
              } catch (error) {
                captureException(error);
                createNotification("Couldn't revoke invite, Try again later", { type: 'error' });
              }
            }}
          />
        </li>
      ))}
      {currentUserIsOnTeam && (
        <li className={styles.addButtonWrap}>
          <AddTeamUserPop
            inviteEmail={inviteEmail ? onInviteEmail : null}
            inviteUser={inviteUser ? onInviteUser : null}
            setWhitelistedDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null}
            members={members}
            whitelistedDomain={team.whitelistedDomain}
          />
        </li>
      )}
      {currentUserCanJoinTeam && (
        <li className={styles.joinButtonWrap}>
          <JoinTeam onClick={joinTeam} />
        </li>
      )}
    </ul>
  );
};

export default TeamUserContainer;
