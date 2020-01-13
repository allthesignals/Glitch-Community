import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CDN_URL } from 'Utils/constants';

import { Button } from '@fogcreek/shared-components';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from 'Components/link';
import ProfileList from 'Components/profile-list';
import Image from 'Components/images/image';

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { useTracker } from 'State/segment-analytics';
import { userIsProjectMember, userIsProjectTeamMember, humanReadableAccessLevel, getProjectType } from 'Models/project';
import { useCurrentUser } from 'State/current-user';
import { useProjectMembers } from 'State/project';
import { useProjectOptions } from 'State/project-options';

import { EditButton, RemixButton, MembershipButton } from './project-actions';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const fullscreenImageURL = `${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Ffullscreen.svg?v=1571867146900`;

const ProfileListWithData = ({ project }) => {
  const { value: members } = useProjectMembers(project.id);
  const { users } = members || {};
  return <ProfileList layout="row" users={users} size="small" />;
};

const ProjectEmbed = ({ project, top, addProjectToCollection, loading, previewOnly }) => {
  const { value: members } = useProjectMembers(project.id);

  const projectOptions = useProjectOptions(project, addProjectToCollection ? { addProjectToCollection } : {});
  const { currentUser } = useCurrentUser();

  const isMember = userIsProjectMember({ members, user: currentUser });
  const canBecomeMember = userIsProjectTeamMember({ project, user: currentUser });

  const [embedKey, setEmbedKey] = useState(0); // used to refresh project embed when users leave or join projects

  const refreshEmbed = () => {
    setEmbedKey(embedKey + 1);
  };

  const trackJoinProject = useTracker('Project Joined');
  const trackLeaveProject = useTracker('Project Left');

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed key={embedKey} domain={project.domain} loading={loading} previewOnly={previewOnly} />
        {previewOnly && (
          <div className={styles.embedBottomBar}>
            <span className={styles.embedLeft}>
              <ProjectLink project={project}>
                <ProjectAvatar project={project} />
                <span className={styles.embedDomainLink}>{project.domain}</span>
              </ProjectLink>
              by
              <span className={styles.embedAuthors}>
                <ProfileListWithData project={project} />
              </span>
            </span>
            <Button as="a" href={`https://${project.domain}.glitch.me`} variant="secondary" target="_blank">
              <Image src={fullscreenImageURL} className={styles.fullscreenImg} height="auto" alt={`open project ${project.domain} in a new tab`} />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <div>
          <div className={styles.buttonWrap}>
            {isMember && <EditButton name={project.id} isMember={isMember} size="small" />}
            {!isMember && !previewOnly && <ReportButton reportedType="project" reportedModel={project} />}
          </div>
          {(projectOptions.leaveProject || projectOptions.joinTeamProject) && (
            <div className={styles.buttonWrap}>
              <MembershipButton
                project={project}
                isMember={isMember}
                isTeamProject={canBecomeMember}
                joinProject={() => {
                  trackJoinProject({
                    projectId: project.id,
                    projectName: project.domain,
                    accessLevel: 'member',
                    projectVisibility: project.private ? 'private' : 'public',
                    numberProjectMembers: project.users.length,
                    numberTeams: project.teams.length,
                  });
                  projectOptions.joinTeamProject();
                }}
                leaveProject={() => {
                  trackLeaveProject({
                    projectId: project.id,
                    projectName: project.domain,
                    projectType: getProjectType(project),
                    accessLevel: humanReadableAccessLevel(project.permission.accessLevel),
                    projectVisibility: project.private ? 'private' : 'public',
                    numberProjectMembers: project.permissions.length,
                    numberTeams: project.teamIds.length,
                  });
                  projectOptions.leaveProject();
                }}
                refreshEmbed={refreshEmbed}
              />
            </div>
          )}
        </div>
        <div>
          {projectOptions.addProjectToCollection && (
            <div className={styles.buttonWrap}>
              <AddProjectToCollection project={project} addProjectToCollection={projectOptions.addProjectToCollection} fromProject />
            </div>
          )}
          <div className={styles.buttonWrap}>
            <RemixButton
              name={project.domain}
              isMember={isMember}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
  loading: PropTypes.oneOf(['lazy', 'eager', 'auto']),
  previewOnly: PropTypes.bool,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
  loading: 'auto',
  previewOnly: false,
};

export default ProjectEmbed;
