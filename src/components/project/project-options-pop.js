import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { Actions, Button, DangerZone, Icon, Popover, Title, UnstyledButton } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

import { emoji } from '../global.styl';

const isTeamProject = ({ currentUser, project }) => currentUser.teams.some((team) => project.teamIds.includes(team.id));
const useTrackedLeaveProject = (leaveProject) => useTrackedFunc(leaveProject, 'Leave Project clicked');

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.some((item) => item.onClick) &&
      (group.some((item) => item.dangerZone) ? (
        <DangerZone key={i}>
          {group.map(
            (item) =>
              item.onClick && (
                <>
                  <Button size="small" variant="warning" key={item.label} onClick={item.onClick}>
                    {item.label} <Icon className={emoji} icon={item.emoji} />
                  </Button>
                  <br />
                </>
              ),
          )}
        </DangerZone>
      ) : (
        <Actions key={i}>
          {group.map(
            (item) =>
              item.onClick && (
                <>
                  <Button size="small" variant="secondary" key={item.label} onClick={item.onClick}>
                    {item.label} <Icon className={emoji} icon={item.emoji} />
                  </Button>
                  <br />
                </>
              ),
          )}
        </Actions>
      )),
  );

const LeaveProjectPopover = ({ project, leaveProject, togglePopover }) => {
  const illustration = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png?v=1502123444938';
  const trackLeaveProject = useTrackedLeaveProject(leaveProject);

  return (
    <>
      <Title>Leave {project.domain}</Title>
      <Actions>
        <Image height="50px" width="auto" src={illustration} alt="" />
        <br />
        Are you sure you want to leave? You'll lose access to this project unless someone else invites you back.
      </Actions>
      <DangerZone>
        <Button
          variant="warning"
          onClick={() => {
            trackLeaveProject(project);
            togglePopover();
          }}
        >
          Leave Project
        </Button>
      </DangerZone>
    </>
  );
};

const ProjectOptionsContent = ({ project, projectOptions, addToCollectionPopover, leaveProjectPopover, leaveProjectDirect }) => {
  const { currentUser } = useCurrentUser();
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');
  const trackedLeaveProjectDirect = useTrackedLeaveProject(leaveProjectDirect);
  const onClickLeaveProject = isTeamProject({ currentUser, project }) ? trackedLeaveProjectDirect : leaveProjectPopover;

  return (
    <>
      <PopoverMenuItems>
        {[
          [
            { onClick: projectOptions.featureProject, label: 'Feature', emoji: 'clapper' },
            { onClick: projectOptions.addPin, label: 'Pin', emoji: 'pushpin' },
            { onClick: projectOptions.removePin, label: 'Un-Pin', emoji: 'pushpin' },
          ],
          [{ onClick: projectOptions.displayNewNote, label: 'Add Note', emoji: 'spiralNotePad' }],
          [{ onClick: projectOptions.addProjectToCollection && addToCollectionPopover, label: 'Add to Collection', emoji: 'framedPicture' }],
          [{ onClick: projectOptions.joinTeamProject, label: 'Join Project', emoji: 'rainbow' }],
          [{ onClick: leaveProjectDirect && onClickLeaveProject, label: 'Leave Project', emoji: 'wave' }],
          [
            { onClick: projectOptions.removeProjectFromTeam, label: 'Remove Project', emoji: 'thumbsDown', dangerZone: true },
            { onClick: onClickDeleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
            { onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
          ],
        ]}
      </PopoverMenuItems>
    </>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) return null;

  const toggleBeforeAction = (togglePopover, action) =>
    action &&
    ((...args) => {
      togglePopover();
      action(...args);
    });
  const toggleBeforeActions = (togglePopover) => mapValues(projectOptions, (action) => toggleBeforeAction(togglePopover, action));

  return (
    <Popover
      align="right"
      renderLabel={({ onClick, ref }) => (
        <UnstyledButton onClick={onClick} ref={ref} label="Project Options for {project.domain}">
          <Icon icon="chevronDown" />
        </UnstyledButton>
      )}
      views={{
        addToCollection: ({ onClose, onBack, setActiveView }) => (
          <AddProjectToCollectionBase
            fromProject
            project={project}
            togglePopover={onClose}
            onBack={onBack}
            addProjectToCollection={projectOptions.addProjectToCollection}
            createCollectionPopover={() => {
              setActiveView('createCollection');
            }}
          />
        ),
        createCollection: ({ onBack }) => (
          <CreateCollectionWithProject onBack={onBack} project={project} addProjectToCollection={projectOptions.addProjectToCollection} />
        ),
        leaveProject: ({ onClose }) => <LeaveProjectPopover project={project} leaveProject={projectOptions.leaveProject} togglePopover={onClose} />,
      }}
    >
      {({ onClose, setActiveView }) => (
        <ProjectOptionsContent
          project={project}
          projectOptions={toggleBeforeActions(onClose)}
          addToCollectionPopover={() => {
            setActiveView('addToCollection');
          }}
          leaveProjectPopover={() => {
            setActiveView('leaveProject');
          }}
          leaveProjectDirect={toggleBeforeAction(onClose, projectOptions.leaveProject)}
        />
      )}
    </Popover>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    permissions: PropTypes.array.isRequired,
    teamIds: PropTypes.array.isRequired,
    private: PropTypes.bool,
    note: PropTypes.any,
    isAddingNewNote: PropTypes.bool,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
