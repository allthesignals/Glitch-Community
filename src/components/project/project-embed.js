import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

const ProjectEmbed = ({ project, top, addProjectToCollection, loading }) => {
  const { value: members } = useProjectMembers(project.id);

  const projectOptions = useProjectOptions(project, addProjectToCollection ? { addProjectToCollection } : {});
  const { currentUser } = useCurrentUser();

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
        <Embed key={embedKey} domain={project.domain} loading={loading} />
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
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
  loading: 'auto',
};

export default ProjectEmbed;
