import React, { useState } from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import classNames from 'classnames/bind';
import { CDN_URL } from 'Utils/constants';

import { Button } from '@fogcreek/shared-components';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from 'Components/link';
import ProfileList from 'Components/profile-list';
import { useProjectMembers } from 'State/project';
import Image from 'Components/images/image';
=======
>>>>>>> 7902cc7257e21918faaf2ccfe4c7b02294532d64

import Embed from 'Components/project/embed';
import ReportButton from 'Components/report-abuse-pop';
import { useTracker, useTrackedFunc } from 'State/segment-analytics';
import { userIsProjectMember, userIsProjectTeamMember } from 'Models/project';
import { useCurrentUser } from 'State/current-user';
import { useProjectMembers } from 'State/project';
import { useProjectOptions } from 'State/project-options';

import { EditButton, RemixButton, MembershipButton } from './project-actions';
import AddProjectToCollection from './add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);
const fullscreenImageURL = `${CDN_URL}/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Ffullscreen.svg?v=1571867146900`;

const ProfileListWithData = ({ project }) => {
  const { value: members } = useProjectMembers(project.id);
  const { users } = members ||  {};
  return <ProfileList layout="row" users={users} size="small" />;
};

const ProjectEmbed = ({ project, top, addProjectToCollection, loading, hideCode }) => {
  const projectOptions = useProjectOptions(project, addProjectToCollection ? { addProjectToCollection } : {});
  const { currentUser } = useCurrentUser();

  const { value: members } = useProjectMembers(project.id);
  const isMember = userIsProjectMember({ members, user: currentUser });
  const canBecomeMember = userIsProjectTeamMember({ project, user: currentUser });

  const [embedKey, setEmbedKey] = useState(0); // used to refresh project embed when users leave or join projects

  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

  const refreshEmbed = () => {
    setEmbedKey(embedKey + 1);
  };

  const trackedLeaveProject = useTrackedFunc(projectOptions.leaveProject, 'Leave Project clicked');
  const trackedJoinProject = useTrackedFunc(projectOptions.joinTeamProject, 'Join Project clicked');

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed key={embedKey} domain={project.domain} loading={loading} hideCode={hideCode} />
        {hideCode && (
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
              <Image src={fullscreenImageURL} className={styles.fullscreenImg} height="auto" alt="fullscreen"/>
            </Button>
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <div>
          <div className={styles.buttonWrap}>
            {isMember ? (
              <EditButton name={project.id} isMember={isMember} size="small" />
            ) : (
              <ReportButton reportedType="project" reportedModel={project} />
            )}
          </div>
          {(projectOptions.leaveProject || projectOptions.joinTeamProject) && (
            <div className={styles.buttonWrap}>
              <MembershipButton
                project={project}
                isMember={isMember}
                isTeamProject={canBecomeMember}
                joinProject={trackedJoinProject}
                leaveProject={trackedLeaveProject}
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
            <RemixButton name={project.domain} isMember={isMember} onClick={trackRemix} />
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
  hideCode: PropTypes.bool,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
  loading: 'auto',
  hideCode: false,
};

export default ProjectEmbed;
