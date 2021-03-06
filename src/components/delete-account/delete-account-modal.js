import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { Actions, Badge, Button, DangerZone, Icon, Info, Overlay, ResultsList, Title, useOverlay, mergeRefs } from '@fogcreek/shared-components';

import { captureException } from 'Utils/sentry';
import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers } from 'State/api';
import { useNotifications } from 'State/notifications';
import { useTracker } from 'State/segment-analytics';

import Link from 'Components/link';
import TeamResultItem from 'Components/team/team-result-item';
import ProjectResultItem from 'Components/project/project-result-item';
import { getTeamLink } from 'Models/team';
import { getProjectLink } from 'Models/project';
import MultiPage from '../layout/multi-page';

import styles from './delete-account-modal.styl';
import { emoji } from '../global.styl';

const DeleteInfo = ({ onClose, first, focusedOnMount, last, next }) => (
  <>
    <Title onClose={onClose} onCloseRef={mergeRefs(first, focusedOnMount)}>
      Close Account
    </Title>
    <Actions>
      <p>Once your account is closed, all of your projects, teams and collections will be unavailable!</p>
      <p>If you are sharing any teams or projects, we'll walk you though transferring ownership before you close your account.</p>
    </Actions>
    <Info>
      <p>
        You can export any of your projects but only <b>before</b> you close your account.
      </p>
      <Button as="a" href="/help/how-do-i-delete-a-project-on-glitch/" className={styles.modalButton} size="small" variant="secondary">
        Learn about exporting <Icon className={emoji} icon="arrowRight" />
      </Button>
    </Info>
    <DangerZone>
      <p>For security purposes, you must confirm via email before we close your account.</p>
      <Button ref={last} onClick={next} className={styles.modalButton} size="small" variant="warning">
        Continue to Close Account
      </Button>
    </DangerZone>
  </>
);

DeleteInfo.propTypes = {
  next: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  last: PropTypes.object.isRequired,
};

const TeamTransfer = ({ onClose, first, focusedOnMount, last, singleAdminTeams, next }) => {
  const { currentUser } = useCurrentUser();
  const [selectedTeam, onTeamSelection] = useState(null);
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
        You must <Link ref={mergeRefs(first, focusedOnMount)} to="/help/how-do-you-change-a-teams-admin/">pick a new team admin</Link> or <Link to="/help/how-do-you-delete-a-team/">deactivate</Link> these teams before you can close your account.
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
          If you close your account, you will automatically be removed from these teams:{' '}
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
        <Button disabled={singleAdminTeams.length > 0} className={styles.actionButton} onClick={next}>
          Continue to Close Account
        </Button>
        <Button className={styles.actionButton} variant="secondary" ref={last} onClick={onClose}>
          Cancel
        </Button>
      </Actions>
    </>
  );
};

TeamTransfer.propTypes = {
  next: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  singleAdminTeams: PropTypes.array.isRequired,
  last: PropTypes.object.isRequired,
};

const ProjectTransfer = ({ onClose, first, focusedOnMount, last, singleAdminProjects, next }) => {
  const [currentlyFocusedProject, onSelectProject] = useState(null);
  useEffect(() => {
    if (!currentlyFocusedProject && singleAdminProjects.length) {
      onSelectProject(singleAdminProjects[0].id);
    }
  }, [singleAdminProjects]);
  return (
    <>
      <Title onCloseRef={mergeRefs(first, focusedOnMount)}>Transfer Project Ownership</Title>
      <Info>
        You must <Link to="/help/how-do-you-change-a-projects-owner/">transfer ownership</Link> or <Link to="/help/how-do-i-delete-a-project-on-glitch/">delete</Link> these projects before you can delete your account.
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
        <Button disabled={singleAdminProjects.length > 0} className={styles.actionButton} onClick={next}>
          Continue to Close Account
        </Button>
        <Button className={styles.actionButton} variant="secondary" onClick={onClose} ref={last}>
          Cancel
        </Button>
      </Actions>
    </>
  );
};

ProjectTransfer.propTypes = {
  next: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  first: PropTypes.object.isRequired,
  focusedOnMount: PropTypes.object.isRequired,
  singleAdminProjects: PropTypes.array.isRequired,
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
        <p>For security purposes, we've sent an email confirmation to the email associated with your account.</p>
        <p>Please click the link in the email to finish closing your account.</p>
        {(soloProjects.length > 0 || soloTeams.length > 0 || soloCollections.length > 0) && (
          <p>
            Once you click the link in the email, the following will no longer be available:{' '}
            <b>
              {soloProjects.length > 0 && <Pluralize count={soloProjects.length} singular="project" />}
              {soloTeams.length > 0 && <Pluralize count={soloTeams.length} singular="team" />}
              {soloCollections.length > 0 && <Pluralize count={soloCollections.length} singular="collection" />}
            </b>
          </p>
        )}
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
  const { requestAccountDeleteEmail } = useAPIHandlers();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const trackClick = useTracker('Account Deletion Initiated');
  const singleAdminTeams = currentUser.teams.filter(
    (team) =>
      team.teamPermission.accessLevel === 30 &&
      team.teamPermissions.filter((admin) => admin.accessLevel === 30).length === 1 &&
      team.teamPermissions.length > 1,
  );
  const singleAdminProjects = currentUser.projects.filter(
    (project) =>
      project.permission.accessLevel === 30 &&
      project.permissions.filter((admin) => admin.accessLevel === 30).length === 1 &&
      project.permissions.length > 1,
  );


  async function triggerEmail(setPage) {
    try {
      await requestAccountDeleteEmail(currentUser);
      setPage('emailConfirm');
    } catch (error) {
      createNotification('Unable to close account, try again later.', { type: 'error' });
      captureException(error);
    }
  }

  const pageController = ({ setPage }) => {
    if (singleAdminProjects.length === 0 && singleAdminTeams.length === 0) {
      triggerEmail(setPage);
    } else if (singleAdminProjects.length > 0) {
      setPage('projectOwnerTransfer');
    } else if (singleAdminTeams.length > 0) {
      setPage('teamOwnerTransfer');
    }
  };

  return (
    <>
      <h2>Close Account</h2>
      <p>Close your account, including all teams, projects, and collections.</p>
      <Button onClick={() => { trackClick(); onOpen(); }} ref={toggleRef}>
        Close Account
      </Button>
      <Overlay open={open} onClose={onClose}>
        {({ first, last, focusedOnMount }) => (
          <MultiPage defaultPage="info">
            {({ page, setPage }) => (
              <>
                {page === 'info' && <DeleteInfo next={() => pageController({ setPage })} onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} />}
                {page === 'projectOwnerTransfer' && <ProjectTransfer next={() => pageController({ setPage })} onClose={onClose} first={first} focusedOnMount={focusedOnMount} last={last} singleAdminProjects={singleAdminProjects} />}
                {page === 'teamOwnerTransfer' && <TeamTransfer next={() => pageController({ setPage })} onClose={onClose} first={first} focusedOnMount={focusedOnMount} singleAdminTeams={singleAdminTeams} last={last} />}
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
