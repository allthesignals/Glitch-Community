import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';

import { PopoverWithButton } from 'Components/popover';
import { getShowUrl, getEditorUrl, getRemixUrl } from 'Models/project';
import LeaveProjectPopover from './leave-project-pop';

import { emoji } from '../global.styl';

export const mediumSmallViewport = 592; // 592px is the cutoff for hiding some of the button text for mobile

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

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
  <Button as="a" href={getEditorUrl(name)} size={size} variant="cta">
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
  const { width } = useWindowDimensions();
  let editButtonText = null;
  if (width < mediumSmallViewport) {
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

export const RemixButton = ({ name, isMember }) => {
  const { width } = useWindowDimensions();

  let remixButtonText = 'Remix';
  if (width > mediumSmallViewport) {
    remixButtonText = isMember ? `${remixButtonText} This` : `${remixButtonText} Your Own`;
  }

  return (
    <Button as="a" href={getRemixUrl(name)} size="small">
      {remixButtonText} <Icon className={emoji} icon="microphone" />
    </Button>
  );
};

RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};

export const MembershipButton = ({ project, isMember, isTeamProject, leaveProject, joinProject }) => {
  const { width } = useWindowDimensions();

  if (!isMember && joinProject) {
    let joinProjectBtnText = 'Join Project';

    if (width < mediumSmallViewport) {
      joinProjectBtnText = 'Join';
    }
    return isTeamProject ? (
      <Button size="small" onClick={joinProject}>
        {joinProjectBtnText} <Icon icon="rainbow" />
      </Button>
    ) : null;
  }

  // let team members leave directly, warn non team members
  if (isTeamProject && leaveProject) {
    let leaveProjectBtnText = 'Leave Project';
    if (width < mediumSmallViewport) {
      leaveProjectBtnText = 'Leave';
    }

    return (
      <Button size="small" onClick={() => leaveProject(project)}>
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
};

MembershipButton.defaultProps = {
  leaveProject: null,
  joinProject: null,
  isMember: false,
  isTeamProject: false,
};
