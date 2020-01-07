import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover } from '@fogcreek/shared-components';

import ResponsiveButton from 'Components/buttons/responsive-button';
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
export const EditButton = ({ name, isMember, size }) => (
  <ResponsiveButton as="a" href={getEditorUrl(name)} size={size} shortText={isMember ? 'Edit' : 'View'}>
    {isMember ? 'Edit Project' : 'View Source'}
  </ResponsiveButton>
);

EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

EditButton.defaultProps = {
  isMember: false,
};

export const RemixButton = ({ name, isMember, onClick }) => (
  <ResponsiveButton as="a" href={getRemixUrl(name)} size="small" onClick={onClick} shortText="Remix" icon={<Icon className={emoji} icon="microphone" />}>
    {isMember ? 'Remix This' : 'Remix Your Own'}
  </ResponsiveButton>
);

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
  if (!isMember && joinProject) {
    return isTeamProject ? (
      <ResponsiveButton
        size="small"
        onClick={() => {
          joinProject();
          refreshEmbed();
        }}
        shortText="Join"
        icon={<Icon icon="rainbow" />}
      >
        Join Team Project
      </ResponsiveButton>
    ) : null;
  }

  // let team members leave directly, warn non team members
  if (isTeamProject && leaveProject) {
    return (
      <ResponsiveButton
        size="small"
        onClick={() => {
          leaveProject(project);
          refreshEmbed();
        }}
        shortText="Leave"
        icon={<Icon icon="wave" />}
      >
        Leave Project
      </ResponsiveButton>
    );
  }
  return (
    <Popover align="left" renderLabel={({ onClick, ref }) => <Button size="small" onClick={onClick} ref={ref}>Leave Project <Icon icon="wave" className={emoji} /></Button>}>
      {({ onClose }) => (
        <LeaveProjectPopover project={project} leaveProject={leaveProject} togglePopover={onClose} />
      )}
    </Popover>
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
