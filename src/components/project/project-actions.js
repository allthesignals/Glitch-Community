import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';

import { PopoverWithButton } from 'Components/popover';
import { getShowUrl, getEditorUrl, getRemixUrl } from 'Models/project';
import useWindowSize from 'Hooks/use-window-size';
import LeaveProjectPopover from './leave-project-pop';

import { emoji } from '../global.styl';

export const mediumSmallViewport = 592; // 592px is the cutoff for hiding some of the button text for mobile

export const ShowButton = ({ name, size }) => (
  <Button as="a" href={getShowUrl(name)} size={size}>
    <Icon icon="sunglasses" /> Show
  </Button>
);

ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

// the Edit Button that appears on the top of the project page in the ProfileWrap
export const EditButtonCta = ({ name, isMember, size }) => (
  <Button as="a" href={getEditorUrl(name)} size={size} variant={isMember ? 'cta' : undefined}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);

EditButtonCta.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

EditButtonCta.defaultProps = {
  isMember: false,
};

// the Edit Button that appears below the embed
export const EditButton = ({ name, isMember, size }) => {
  const [width] = useWindowSize();
  let editButtonText = null;
  if (width && width < mediumSmallViewport) {
    editButtonText = isMember ? 'Edit' : 'View';
  } else {
    editButtonText = isMember ? 'Edit Project' : 'View Source';
  }
  return (
    <Button as="a" href={getEditorUrl(name)} size={size}>
      {editButtonText}
    </Button>
  );
};

EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

EditButton.defaultProps = {
  isMember: false,
};

export const RemixButton = ({ name, isMember, onClick }) => {
  const [width] = useWindowSize();

  let remixButtonText = 'Remix';
  if (!width || width > mediumSmallViewport) {
    remixButtonText = isMember ? `${remixButtonText} This` : `${remixButtonText} Your Own`;
  }

  return (
    <Button as="a" href={getRemixUrl(name)} size="small" onClick={onClick}>
      {remixButtonText} <Icon className={emoji} icon="microphone" />
    </Button>
  );
};

RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  onClick: PropTypes.func, // used for analytics events
};

RemixButton.defaultProps = {
  isMember: false,
  onClick: undefined,
};

export const MembershipButton = ({ project, isMember, isTeamProject, leaveProject, joinProject, refreshEmbed }) => {
  const [width] = useWindowSize();

  if (!isMember && joinProject) {
    let joinProjectBtnText = 'Join Team Project';

    if (width && width < mediumSmallViewport) {
      joinProjectBtnText = 'Join';
    }
    return isTeamProject ? (
      <Button
        size="small"
        onClick={() => {
          joinProject();
          refreshEmbed();
        }}
      >
        {joinProjectBtnText} <Icon icon="rainbow" />
      </Button>
    ) : null;
  }

  // let team members leave directly, warn non team members
  if (isTeamProject && leaveProject) {
    let leaveProjectBtnText = 'Leave Project';
    if (width && width < mediumSmallViewport) {
      leaveProjectBtnText = 'Leave';
    }

    return (
      <Button
        size="small"
        onClick={() => {
          leaveProject(project);
          refreshEmbed();
        }}
      >
        {leaveProjectBtnText} <Icon icon="wave" />
      </Button>
    );
  }
  return (
    <PopoverWithButton buttonProps={{ emoji: 'wave', size: 'small' }} buttonText="Leave Project">
      {({ togglePopover }) => <LeaveProjectPopover project={project} leaveProject={leaveProject} togglePopover={togglePopover} align="left" />}
    </PopoverWithButton>
  );
};

MembershipButton.propTypes = {
  isMember: PropTypes.bool,
  isTeamProject: PropTypes.bool,
  leaveProject: PropTypes.func,
  joinProject: PropTypes.func,
  refreshEmbed: PropTypes.func,
};

MembershipButton.defaultProps = {
  leaveProject: null,
  joinProject: null,
  isMember: false,
  isTeamProject: false,
  refreshEmbed: null,
};
