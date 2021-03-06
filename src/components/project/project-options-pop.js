import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { Actions, Button, DangerZone, Icon, Popover, Title } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { PopoverMenuButton } from 'Components/popover';
import { humanReadableAccessLevel, getProjectType } from 'Models/project';
import { useCurrentUser } from 'State/current-user';
import { useTracker } from 'State/segment-analytics';

import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

import styles from './popover.styl';
import { emoji } from '../global.styl';

const isTeamProject = ({ currentUser, project }) => currentUser.teams.some((team) => project.teamIds.includes(team.id));

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.filter((group) => group.some((item) => item.onClick)).map((group, i) =>
    (group.some((item) => item.dangerZone) ? (
      <DangerZone key={i}>
        {group.map(
          (item) =>
            item.onClick && (
              <div className={styles.stackedButtons} key={item.label}>
                <Button className={styles.noWrap} size="small" variant="warning" onClick={item.onClick}>
                  {item.label} <Icon className={emoji} icon={item.emoji} />
                </Button>
                <br />
              </div>
            ),
        )}
      </DangerZone>
    ) : (
      <Actions key={i}>
        {group.map(
          (item) =>
            item.onClick && (
              <div className={styles.stackedButtons} key={item.label}>
                <Button className={styles.noWrap} size="small" variant="secondary" onClick={item.onClick}>
                  {item.label} <Icon className={emoji} icon={item.emoji} />
                </Button>
                <br />
              </div>
            ),
        )}
      </Actions>
    )),
  );

const LeaveProjectPopover = ({ project, leaveProject, togglePopover }) => {
  const illustration = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png?v=1502123444938';
  const tracker = useTracker('Project Left');
  return (
    <>
      <Title>Leave {project.domain}</Title>
      <Actions>
        <Image height="50px" width="auto" src={illustration} alt="" />
        <br />
        <p>Are you sure you want to leave? You'll lose access to this project unless someone else invites you back.</p>
      </Actions>
      <DangerZone>
        <Button
          variant="warning"
          onClick={() => {
            leaveProject(project);
            tracker({
              projectId: project.id,
              projectName: project.domain,
              projectType: getProjectType(project),
              accessLevel: humanReadableAccessLevel(project.permission.accessLevel),
              projectVisibility: project.private ? 'private' : 'public',
              numberProjectMembers: project.permissions.length,
              numberTeams: project.teamIds.length,
            });
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
  const onClickLeaveProject = isTeamProject({ currentUser, project }) ? leaveProjectDirect : leaveProjectPopover;

  return (
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
          { onClick: projectOptions.deleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
          { onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
        ],
      ]}
    </PopoverMenuItems>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);
  const tracker = useTracker('Project Left');

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
        <PopoverMenuButton onClick={onClick} ref={ref} aria-label={`Project Options for ${project.domain}`} />
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
        createCollection: ({ onBack, onClose }) => (
          <CreateCollectionWithProject
            onBack={onBack}
            onClose={onClose}
            project={project}
            addProjectToCollection={projectOptions.addProjectToCollection}
          />
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
          leaveProjectDirect={() => {
            tracker({
              projectId: project.id,
              projectName: project.domain,
              projectType: getProjectType(project),
              accessLevel: humanReadableAccessLevel(project.permission.accessLevel),
              projectVisibility: project.private ? 'private' : 'public',
              numberProjectMembers: project.permissions.length,
              numberTeams: project.teamIds.length,
            });
            toggleBeforeAction(onClose, projectOptions.leaveProject);
          }}
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
