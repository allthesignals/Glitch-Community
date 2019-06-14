import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

import { getLink as getTeamLink, getAvatarUrl as getTeamAvatarUrl } from 'Models/team';
import { getAvatarThumbnailUrl as getUserAvatarUrl } from 'Models/user';
import Image from 'Components/images/image';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { MultiPopover, PopoverContainer, PopoverActions, PopoverInfo, PopoverDialog, PopoverTitle } from 'Components/popover';
import CreateTeamPop from 'Components/create-team-pop';
import { useTrackedFunc, useTracker } from 'State/segment-analytics';

import { NestedPopover } from '../../presenters/pop-overs/popover-nested';

import styles from './styles.styl';
import emojiStyles from '../images/emoji.styl';

// Create Team button

const CreateTeamButton = ({ showCreateTeam }) => {
  const onClickCreateTeam = useTrackedFunc(showCreateTeam, 'Create Team clicked');
  return (
    <Button size="small" emoji="herb" onClick={onClickCreateTeam}>
      Create Team
    </Button>
  );
};

CreateTeamButton.propTypes = {
  showCreateTeam: PropTypes.func.isRequired,
};

// Team List

const TeamList = ({ teams, showCreateTeam }) => {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  return (
    <PopoverActions>
      {orderedTeams.map((team) => (
        <div className={styles.buttonWrap} key={team.id}>
          <Button
            href={getTeamLink(team)}
            size="small"
            type="tertiary"
            image={
              <Image
                className={`${styles.teamAvatar} ${emojiStyles.emoji}`}
                src={getTeamAvatarUrl({ ...team, size: 'small' })}
                alt=""
                width={16}
                height={16}
              />
            }
          >
            {team.name}
          </Button>
        </div>
      ))}
      <CreateTeamButton showCreateTeam={showCreateTeam} />
    </PopoverActions>
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

const UserOptionsPop = ({ togglePopover, showCreateTeam, user, signOut, showNewStuffOverlay, focusFirstElement, superUserHelpers }) => {
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser } = superUserHelpers;

  const trackLogout = useTracker('Logout');

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

  return (
    <PopoverDialog className={styles.userOptionsPop} ref={focusFirstElement}>
      <PopoverTitle>
        <UserLink user={user}>
          <div className={styles.userAvatarContainer} style={{ backgroundColor: user.color }}>
            <Image src={getUserAvatarUrl(user)} alt="Your avatar" />
          </div>
          <div className={styles.userInfo}>
            <Text>{user.name || 'Anonymous'}</Text>
            {user.login && (
              <div className={styles.userLogin}>
                <Text>@{user.login}</Text>
              </div>
            )}
          </div>
        </UserLink>
      </PopoverTitle>

      <TeamList teams={user.teams} showCreateTeam={showCreateTeam} userIsAnon={!user.login} />

      <PopoverInfo>
        {(canBecomeSuperUser || !!superUserFeature) && (
          <div className="user-options-pop-checkbox">
            <CheckboxButton value={!!superUserFeature} onChange={toggleSuperUser} type="tertiary" matchBackground>
              Super User
            </CheckboxButton>
          </div>
        )}
        <div className={styles.buttonWrap}>
          <Button type="tertiary" size="small" emoji="dogFace" onClick={clickNewStuff}>
            New Stuff
          </Button>
        </div>
        <div className={styles.buttonWrap}>
          <Button type="tertiary" size="small" emoji="ambulance" href="https://support.glitch.com">
            Support
          </Button>
        </div>
        <Button type="tertiary" size="small" emoji="balloon" onClick={clickSignout}>
          Sign Out
        </Button>
      </PopoverInfo>
    </PopoverDialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

function CheckForCreateTeamHash(props) {
  return props.children(window.location.hash === '#create-team');
}

// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer(props) {
  const avatarUrl = getUserAvatarUrl(props.user);
  const avatarStyle = { backgroundColor: props.user.color };

  return (
    <CheckForCreateTeamHash>
      {(createTeamOpen) => (
        <PopoverContainer startOpen={createTeamOpen}>
          {({ togglePopover, visible, focusFirstElement }) => {
            const userOptionsButton = (
              <Button type="dropdown" onClick={togglePopover} disabled={!props.user.id} type="button">
                <img className="user-avatar" src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options" />
                <div className="user-options-dropdown-wrap">
                  <span className="down-arrow icon" />
                </div>
              </Button>
            );

            return (
              <TooltipContainer
                className="button user-options-pop-button"
                target={userOptionsButton}
                tooltip="User options"
                id="user-options-tooltip"
                type="action"
                align={['right']}
              >
                {visible && (
                  <MultiPopover
                    views={{
                      createTeam: (showCreateTeam) => <CreateTeamPop />,
                    }}
                  >
                    {(showCreateTeam) => <UserOptionsPop {...props} {...{ togglePopover, showCreateTeam, focusFirstElement }} />}
                  </MultiPopover>
                )}
              </TooltipContainer>
            );
          }}
        </PopoverContainer>
      )}
    </CheckForCreateTeamHash>
  );
}

UserOptionsAndCreateTeamPopContainer.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    teams: PropTypes.array.isRequired,
  }).isRequired,
};
