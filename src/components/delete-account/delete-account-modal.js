import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { Actions, Badge, Button, DangerZone, Icon, Info, Overlay, ResultsList, Title, useOverlay, mergeRefs } from '@fogcreek/shared-components';

import { useCurrentUser } from 'State/current-user';

import Link from 'Components/link';
import TeamResultItem from 'Components/team/team-result-item';
import ProjectResultItem from 'Components/project/project-result-item';
import { getTeamLink } from 'Models/team';
import { getProjectLink } from 'Models/project';
import MultiPage from '../layout/multi-page';

import styles from './delete-account-modal.styl';
import { emoji } from '../global.styl';

const DeleteInfo = ({ setPage, onClose, first, focusedOnMount, last }) => (
  <>
    <Title onClose={onClose} onCloseRef={mergeRefs(first, focusedOnMount)}>
      Delete Account <Icon className={emoji} icon="coffin" />
    </Title>
    <Actions>
      <p>Once your account is deleted, all of your project, teams and collections will be gone forever!</p>
      <p>If you are sharing any teams or projects, we'll walk you though transferring ownership before you delete your account.</p>
    </Actions>
    <Info>
      <p>
        You can export any of your projects but only <b>before</b> you delete your account.
      </p>
      <Button onClick={() => console.log('Learning more')} className={styles.modalButton} size="small" variant="secondary">
        Learn about exporting <Icon className={emoji} icon="arrowRight" />
      </Button>
    </Info>
    <DangerZone>
      <p>For security purposes, you must confirm via email before we delete your account.</p>
      <Button ref={last} onClick={() => setPage('projectOwnerTransfer')} className={styles.modalButton} size="small" variant="warning">
        Continue to Delete Account
      </Button>
    </DangerZone>
  </>
);

DeleteInfo.propTypes = {
  setPage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  last: PropTypes.object.isRequired,
};

const TeamTransfer = ({ setPage, onClose, first, focusedOnMount, last }) => {
  const { currentUser } = useCurrentUser();
  const [selectedTeam, onTeamSelection] = useState(null);
  const singleAdminTeams = currentUser.teams.filter(
    (team) =>
      team.teamPermission.accessLevel === 30 &&
      team.teamPermissions.filter((admin) => admin.accessLevel === 30).length === 1 &&
      team.teamPermissions.length > 1,
  );
  const otherTeams = currentUser.teams.filter(
    (team) => team.teamPermission.accessLevel === 20 || team.teamPermissions.filter((admin) => admin.accessLevel === 30).length > 1,
  );
  useEffect(() => {
    if (!selectedTeam && singleAdminTeams.length) {
      onTeamSelection(singleAdminTeams[0].id);
    }
  }, [singleAdminTeams]);
  return (
    <>
      <Title>Transfer Team Ownership</Title>
      <Info>
        You must <Link ref={mergeRefs(first, focusedOnMount)} to="/">pick a new team admin</Link> or <Link to="/">delete</Link> these teams before you can delete your account.
      </Info>
      {singleAdminTeams.length > 0 ? (
        <ResultsList value={selectedTeam} onChange={onTeamSelection} options={singleAdminTeams}>
          {({ item: team }) => <TeamResultItem team={team} onClick={() => window.open(`${getTeamLink(team)}`, '_blank')} />}
        </ResultsList>
      ) : (
        <Actions>
          <Icon className={emoji} icon="victoryHand" />
          All Done
        </Actions>
      )}
      <Info className={styles.remaining}>
        <p>
          <Badge className={styles.number}>{singleAdminTeams.length}</Badge> <Pluralize count={singleAdminTeams.length} showCount={false} singular="team" /> to update
        </p>
      </Info>
      {otherTeams.length > 0 && (
        <Info>
          If you delete your account, you will automatically be removed from these teams:{' '}
          {otherTeams
            .map((team) => (
              <Link key={team.id} to={`@${team.name}`}>
                {team.name}
              </Link>
            )).reduce((prev, curr) => [prev, ', ', curr])
          }
        </Info>
      )}
      <Actions>
        <Button disabled={singleAdminTeams.length > 0} className={styles.actionButton} onClick={() => setPage('emailConfirm')}>
          Continue to Delete Account
        </Button>
        <Button className={styles.actionButton} variant="secondary" ref={last} onClick={onClose}>
          Close
        </Button>
      </Actions>
    </>
  );
};

TeamTransfer.propTypes = {
  setPage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  last: PropTypes.object.isRequired,
};

const ProjectTransfer = ({ setPage, onClose, first, focusedOnMount, last }) => {
  const { currentUser } = useCurrentUser();
  const [currentlyFocusedProject, onSelectProject] = useState(null);
  const singleAdminProjects = currentUser.projects.filter(
    (project) =>
      project.permission.accessLevel === 30 &&
      project.permissions.filter((admin) => admin.accessLevel === 30).length === 1 &&
      project.permissions.length > 1,
  );
  useEffect(() => {
    if (!currentlyFocusedProject && singleAdminProjects.length) {
      onSelectProject(singleAdminProjects[0].id);
    }
  }, [singleAdminProjects]);
  return (
    <>
      <Title onCloseRef={mergeRefs(first, focusedOnMount)}>Transfer Project Ownership</Title>
      <Info>
        You must <Link to="/">transfer ownership</Link> or <Link to="/">delete</Link> these projects before you can delete your account.
      </Info>
      {singleAdminProjects.length > 0 ? (
        <ResultsList value={currentlyFocusedProject} onChange={onSelectProject} options={singleAdminProjects} scroll>
          {({ item: project }) => (
            <ProjectResultItem project={project} onClick={() => window.open(`${getProjectLink(project)}`, '_blank')} />
          )}
        </ResultsList>
      ) : (
        <Actions>
          <Icon className={emoji} icon="victoryHand" />
          All Done
        </Actions>
      )}
      <Info className={styles.remaining}>
        <p>
          <Badge className={styles.number}>{singleAdminProjects.length}</Badge> projects to update
        </p>
      </Info>
      <Actions>
        <Button disabled={singleAdminProjects.length > 0} className={styles.actionButton} onClick={() => setPage('teamOwnerTransfer')}>
          Continue to Delete Account
        </Button>
        <Button className={styles.actionButton} variant="secondary" onClick={onClose} ref={last}>
          Close
        </Button>
      </Actions>
    </>
  );
};

ProjectTransfer.propTypes = {
  setPage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  last: PropTypes.object.isRequired,
};

const EmailConfirm = ({ onClose, first, focusedOnMount, last }) => {
  const { currentUser } = useCurrentUser();
  const soloProjects = currentUser.projects.filter((project) => project.permissions.length === 1);
  const soloTeams = currentUser.teams.filter((team) => team.teamPermissions.length === 1);
  const soloCollections = currentUser.collections; // all collections are solo, at least currently
  return (
    <>
      <Title>Email Confirmation Sent</Title>
      <Actions>
        <p>For security purposes, we've sent an email confirmation.</p>
        <p>Please click the link in the email to finish deleting your account.</p>
        <p>
          If you choose to delete your account,{' '}
          <b>
            <Pluralize count={soloProjects.length} singular="project" />, <Pluralize count={soloTeams.length} singular="team" />, and{' '}
            <Pluralize count={soloCollections.length} singular="collection" />
          </b>{' '}
          will be deleted forever.
        </p>
      </Actions>
      <Actions>
        <Button onClick={onClose} ref={mergeRefs(first, last, focusedOnMount)}>
          Close
        </Button>
      </Actions>
    </>
  );
};

EmailConfirm.propTypes = {
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  last: PropTypes.object.isRequired,
};

const DeleteSettings = () => {
  const { open, onOpen, onClose, toggleRef } = useOverlay();
  return (
    <>
      <h2>Delete Account</h2>
      <Button onClick={onOpen} ref={toggleRef}>
        Delete Account <Icon className={emoji} icon="coffin" />
      </Button>
      <Overlay open={open} onClose={onClose}>
        {({ first, last, focusedOnMount }) => (
          <MultiPage defaultPage="info">
            {({ page, setPage }) => (
              <>
                {page === 'info' ? (
                  <DeleteInfo setPage={setPage} onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} />
                ) : null}
                {page === 'projectOwnerTransfer' && <ProjectTransfer setPage={setPage} onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} />}
                {page === 'teamOwnerTransfer' && <TeamTransfer setPage={setPage} onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} />}
                {page === 'emailConfirm' && <EmailConfirm onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} />}
              </>
            )}
          </MultiPage>
        )}
      </Overlay>
    </>
  );
};

export default DeleteSettings;
