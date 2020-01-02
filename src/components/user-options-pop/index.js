import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Actions, Button, CheckboxButton, Icon, Info, Loader, Popover, Title, UnstyledButton } from '@fogcreek/shared-components';

import { getUserAvatarThumbnailUrl } from 'Models/user';
import Image from 'Components/images/image';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Link, { TeamLink, UserLink } from 'Components/link';
import CreateTeamPop from 'Components/create-team-pop';
import { useGlobals } from 'State/globals';
import { useCurrentUser, useSuperUserHelpers } from 'State/current-user';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';

import styles from './styles.styl';
import { emoji } from '../global.styl';

// Create Team button
const CreateTeamButton = ({ showCreateTeam }) => (
  <Button size="small" onClick={showCreateTeam}>
    Create Team <Icon className={emoji} icon="herb" />
  </Button>
);

CreateTeamButton.propTypes = {
  showCreateTeam: PropTypes.func.isRequired,
};

// Team List

const TeamList = ({ teams, showCreateTeam }) => {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  return (
    <Actions>
      {orderedTeams.map((team) => (
        <div className={styles.buttonWrap} key={team.id}>
          <Button
            textwrap
            as={TeamLink}
            team={team}
            size="small"
            variant="secondary"
          >
            {team.name} <TeamAvatar team={team} size="small" className={emoji} tiny hideTooltip />
          </Button>
        </div>
      ))}
      <CreateTeamButton showCreateTeam={showCreateTeam} />
    </Actions>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      hasAvatarImage: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showCreateTeam: PropTypes.func.isRequired,
};

// User Options 🧕

const UserOptionsPop = ({ togglePopover, showCreateTeam, showNewStuffOverlay }) => {
  const { currentUser: user, clear: signOut } = useCurrentUser();
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser, isLoading } = useSuperUserHelpers();

  const trackLogout = useTracker('Signed Out');

  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };

  const clickSignout = () => {
    if (!user.login) {
      if (
        // eslint-disable-next-line
        !window.confirm(`You won't be able to sign back in under this same anonymous account.
Are you sure you want to sign out?`)
      ) {
        return;
      }
    }
    togglePopover();
    trackLogout();
    window.analytics.reset();
    signOut();
  };

  const userPasswordEnabled = useDevToggle('User Passwords');

  return (
    <div className={styles.userOptionsPop}>
      <Title>
        <UserLink user={user}>
          <div className={styles.userAvatarContainer} style={{ backgroundColor: user.color }}>
            <Image src={getUserAvatarThumbnailUrl(user)} alt="Your avatar" />
          </div>
          <div className={styles.userInfo}>
            {user.name || 'Anonymous'}
            {user.login && <div className={styles.userLogin}>@{user.login}</div>}
          </div>
        </UserLink>
      </Title>

      <TeamList teams={user.teams} showCreateTeam={showCreateTeam} userIsAnon={!user.login} />

      <Info>
        {(canBecomeSuperUser || !!superUserFeature) && (
          <div className={styles.buttonWrap}>
            {isLoading && <Loader style={{ width: '20px' }} />}
            {!isLoading && (
              <CheckboxButton className={styles.buttonWrap} size="small" value={!!superUserFeature} onChange={toggleSuperUser} variant="secondary">
                Super User
              </CheckboxButton>
            )}
          </div>
        )}
        <div className={styles.buttonWrap}>
          <Button variant="secondary" size="small" onClick={clickNewStuff}>
            New Stuff <Icon className={emoji} icon="dogFace" />
          </Button>
        </div>
        <div className={styles.buttonWrap}>
          <Button as={Link} variant="secondary" size="small" to="https://glitch.com/help/">
            Help Center <Icon className={emoji} icon="ambulance" />
          </Button>
        </div>
        {userPasswordEnabled && (
          <div className={styles.buttonWrap}>
            <Button as={Link} size="small" variant="secondary" to="/settings">
              Account Settings <Icon className={emoji} icon="key" />
            </Button>
          </div>
        )}
        <Button variant="secondary" size="small" onClick={clickSignout}>
          Sign Out <Icon className={emoji} icon="balloon" />
        </Button>
      </Info>
    </div>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

function CheckForCreateTeamHash(props) {
  const { location } = useGlobals();
  return props.children(location.hash === '#create-team');
}

// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer({ showNewStuffOverlay }) {
  const { currentUser: user } = useCurrentUser();
  const avatarStyle = { backgroundColor: user.color };

  return (
    <CheckForCreateTeamHash>
      {(createTeamOpen) => (
        <Popover
          startOpen={createTeamOpen}
          initialView={createTeamOpen ? 'createTeam' : 'UserOptionsPop'}
          align="right"
          renderLabel={({ onClick, ref }) => {
            const userOptionsButton = (
              <UnstyledButton type="dropDown" onClick={onClick} decorative={!user.id} ref={ref}>
                <span className={styles.userOptionsWrap}>
                  <span className={styles.userOptionsButtonAvatar}>
                    <UserAvatar user={user} hideTooltip withinButton style={avatarStyle} />
                  </span>
                  <Icon className={styles.userOptionsArrow} icon="chevronDown" />
                </span>
              </UnstyledButton>
            );
            return <TooltipContainer target={userOptionsButton} tooltip="User options" type="action" align={['right']} />;
          }}
          views={{
            createTeam: ({ onBack }) => <CreateTeamPop onBack={onBack} />,
          }}
        >
          {({ onClose, setActiveView }) => (
            <UserOptionsPop
              showNewStuffOverlay={showNewStuffOverlay}
              togglePopover={onClose}
              showCreateTeam={() => {
                setActiveView('createTeam');
              }}
            />
          )}
        </Popover>
      )}
    </CheckForCreateTeamHash>
  );
}
