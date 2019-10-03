 import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';

import { PopoverWithButton } from 'Components/popover';
import { getShowUrl, getEditorUrl, getRemixUrl } from 'Models/project';
import LeaveProjectPopover from './leave-project-pop';

import { emoji } from '../global.styl';

export const ShowButton = ({ name, size }) => (
  <Button as="a" href={getShowUrl(name)} size={size}>
    <Icon icon="sunglasses" /> Show
  </Button>
);

ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({ name, isMember, size }) => (
  <Button as="a" href={getEditorUrl(name)} size={size} variant={isMember ? 'cta' : undefined}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);

EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

EditButton.defaultProps = {
  isMember: false,
};

export const RemixButton = ({ name, isMember }) => (
  <Button as="a" href={getRemixUrl(name)} size="small">
    {isMember ? 'Remix This' : 'Remix your own'} <Icon className={emoji} icon="microphone" />
  </Button>
);

RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};

export const MembershipButton = ({ project, isMember, isTeamProject, leaveProject, joinProject }) => {
  if (!isMember && joinProject) {
    return isTeamProject ? (
      <Button size="small" onClick={joinProject}>
        Join Project <Icon icon="rainbow" />
      </Button>
    ) : null;
  }

  // let team members leave directly, warn non team members
  if (isTeamProject && leaveProject) return <Button size="small" onClick={() => leaveProject(project)}>Leave Project <Icon icon="wave" /></Button>;
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
